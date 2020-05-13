#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')
const tmp = require('tmp')
const chalk = require('chalk')
const { execSync } = require('child_process')
const yargs = require('yargs')
const getValidFileNames = require('./getValidFileNames')
const validTexturePackerOptions = require('./validTexturePackerOptions')
const {
  getFolderPath,
  getFileName,
  shouldFlip,
  flipFileName,
  removeInputFolderFromPath,
} = require('./util')

yargs
  .option('input', {
    alias: 'i',
    describe: 'Input folder name',
  })
  .option('output', {
    alias: 'o',
    describe: 'Output sprite sheet name',
  })
  .option('flip', {
    describe:
      'File names that end with "left" or "right" will also create horizontally flipped copies',
  })
  .config('config', 'Path to a JSON config file')
  .boolean('flip')
  .demandOption(['input', 'output'])
  .parse()

const {
  argv: { input: inputFolder, output: outputFile, flip: flipEnabled, ...rest },
} = yargs

const texturePackerOptionEntries = Object.entries(rest).filter(
  ([key]) => !!validTexturePackerOptions[key],
)

const texturePackerOptions = texturePackerOptionEntries
  .map(([key, value]) => {
    return `--${key} ${value}`
  })
  .reduce((string, option) => `${string} ${option}`, '')

if (texturePackerOptionEntries.length > 0) {
  console.log()
  console.log(`  Generating sprite sheet using options:`)
  console.log()
  texturePackerOptionEntries.forEach(([key, value]) => {
    console.log(chalk.cyan(`    --${key}: ${value}`))
  })
}

let pngFilesMunched = 0
let piskelFilesMunched = 0

const PISKEL = 'piskel'
const PNG = 'png'

if (!fs.existsSync(inputFolder)) {
  console.log()
  console.error(
    `  ${chalk.red('Could not find input folder')} ${chalk.blue(
      inputFolder,
    )}. ${chalk.red('Did you misspell it?')}`,
  )
  console.log()
  process.exit(1)
}

/**
 * @param {string[]} layersJSON
 */
const parseLayersJSON = (layersJSON) => {
  /**
   * @param {string} layerJSON
   * @param {number} index
   */
  return layersJSON.map((layerJSON, index) => {
    const layer = JSON.parse(layerJSON)
    const b64png = layer.chunks[0].base64PNG.split(',', 2)[1]
    const png = Buffer.from(b64png, 'base64')
    return {
      index,
      opacity: layer.opacity,
      png,
      name: `layer-${index}.png`,
    }
  })
}

const writeLayersToFiles = ({ destinationFolderPath, layers }) => {
  /**
   * @param {{ name: string; png: any; opacity: number; }} layer
   */
  layers.forEach((layer) => {
    const destinationPath = path.join(destinationFolderPath, layer.name)
    fs.writeFileSync(destinationPath, layer.png)
    if (layer.opacity !== 1) {
      applyOpacity(destinationPath, layer.opacity)
    }
  })
}

const mergeLayers = ({ destinationFolderPath, fileName, layers }) => {
  const destinationFullPath = path.join(
    destinationFolderPath,
    `${fileName}.png`,
  )
  if (layers.length > 1) {
    const /**
       * @param {{ name: string; }} layer
       */
      oldFilePaths = layers.map((layer) =>
        path.join(destinationFolderPath, layer.name),
      )
    const /**
       * @param {any} acc
       * @param {any} oldFilePath
       */
      layerFilePaths = oldFilePaths.reduce(
        (acc, oldFilePath) => `${acc} ${oldFilePath}`,
        '',
      )

    execSync(
      `magick convert -background transparent -flatten ${layerFilePaths} ${destinationFullPath}`,
    )

    /**
     * @param {any} oldFilePath
     */
    oldFilePaths.forEach((oldFilePath) => {
      fs.removeSync(oldFilePath)
    })
  } else {
    const oldFilePath = path.join(destinationFolderPath, layers[0].name)
    fs.renameSync(oldFilePath, destinationFullPath)
  }
}

/**
 * @param {string} filePath
 * @param {any} opacity
 */
const applyOpacity = (filePath, opacity) => {
  execSync(
    `magick convert -alpha on -channel a -evaluate multiply ${opacity} ${filePath} ${filePath}`,
  )
}

const splitFrames = ({
  flip,
  destinationFileName,
  inputFullPath,
  width,
  height,
  destinationFolderPath,
}) => {
  const destinationFullPath = path.join(
    destinationFolderPath,
    `${destinationFileName}-%01d.png`,
  )

  const flop = flip ? '-flop' : ''

  // * Since Piskel frame numbers start at 1, so should our output
  const scene = '-scene 1'

  execSync(
    `magick convert ${inputFullPath} -crop ${width}x${height} ${flop} ${scene} ${destinationFullPath}`,
  )
}

/**
 * @param {any[]} filePaths
 * @param {string} tempFolderName
 */
const processFilesAndCopyToTempFolder = (filePaths, tempFolderName) => {
  /**
   * @param {string} sourceFullPath
   */
  filePaths.forEach((sourceFullPath) => {
    const fileName = getFileName(sourceFullPath)
    const sourceFolderPath = getFolderPath(sourceFullPath)

    const destinationFolderPath = path.join(
      tempFolderName,
      removeInputFolderFromPath(inputFolder, sourceFolderPath),
    )

    fs.ensureDirSync(destinationFolderPath)

    // * PNG *
    if (sourceFullPath.endsWith(PNG)) {
      pngFilesMunched += 1
      const destinationFullPath = path.join(
        destinationFolderPath,
        `${fileName}.png`,
      )

      fs.copySync(sourceFullPath, destinationFullPath)

      if (flipEnabled && shouldFlip(fileName)) {
        const flippedFileName = flipFileName(fileName)
        const destinationFullPath = path.join(
          destinationFolderPath,
          `${flippedFileName}.png`,
        )
        fs.copySync(sourceFullPath, destinationFullPath)

        execSync(
          `magick convert ${destinationFullPath} -flop ${destinationFullPath}`,
        )
      }
      // * PISKEL *
    } else if (sourceFullPath.endsWith(PISKEL)) {
      piskelFilesMunched += 1
      const data = JSON.parse(fs.readFileSync(sourceFullPath, 'UTF-8'))

      const {
        piskel: { height, width, layers: layersJSON },
      } = data

      const layers = parseLayersJSON(layersJSON)

      writeLayersToFiles({ destinationFolderPath, layers })
      mergeLayers({
        destinationFolderPath,
        fileName,
        layers,
      })

      const inputFullPath = `${path.join(destinationFolderPath, fileName)}.png`

      splitFrames({
        flip: false,
        destinationFileName: fileName,
        width,
        height,
        destinationFolderPath,
        inputFullPath,
      })
      if (flipEnabled && shouldFlip(fileName)) {
        splitFrames({
          flip: true,
          destinationFileName: flipFileName(fileName),
          inputFullPath,
          width,
          height,
          destinationFolderPath,
        })
      }
      fs.removeSync(inputFullPath)
    }
  })
}

const tempFolder = tmp.dirSync({ unsafeCleanup: true })
const validFileNames = getValidFileNames(inputFolder)

try {
  processFilesAndCopyToTempFolder(validFileNames, tempFolder.name)
} catch (error) {
  console.error('muncher: Error when processing files')
  console.error(error)
  process.exit(1)
}

try {
  const texturePackerResult = execSync(
    `texturepacker --data ${outputFile}.json --format json --sheet ${outputFile}.png ${texturePackerOptions} ${tempFolder.name}`,
  )
  console.log()
  console.log(`  ${chalk.green('Sprite sheet created!')}`)
  console.log()
  console.log(`  ${chalk.blue(piskelFilesMunched)} .piskel file(s) munched`)
  console.log(`  ${chalk.blue(pngFilesMunched)} .png file(s) munched`)
  console.log()

  // * Log output from texture packer:
  // * Spritesheet name and dimensions
  const outputRows = texturePackerResult.toString().split('\n')
  outputRows.forEach((row) => {
    console.log(`  ${row}`)
  })
  console.log()
} catch (error) {
  // * Don't log the error since error is already displayed by Texture packer
  process.exit(1)
}
