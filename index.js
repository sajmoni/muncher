#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const fs = require('fs')
const tmp = require('tmp')
const yargs = require('yargs')

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
    describe: 'File names that end with "left" or "right" will also create horizontally flipped copies',
  })
  .boolean('flip')
  .demandOption(['input', 'output'])
  .parse()

const inputFolder = yargs.argv.input
const outputFile = yargs.argv.output
const flipEnabled = yargs.argv.flip

let pngFilesMunched = 0
let piskelFilesMunched = 0

const tmpObj = tmp.dirSync({ unsafeCleanup: false })
const tempFolder = createFolder(path.join(tmpObj.name, 'temp/'))
const exportFolder = createFolder(path.join(tmpObj.name, 'export/'))

// TODO: Only check for left and right and the end of the file name
// * Add a file with left in the middle to test this
const shouldFlip = (name) => flipEnabled && (name.includes('left') || name.includes('right'))

// TODO: Make sure that only "left" and "right" at the end of the file name is replaced
const flipFileName = (name) => (name.includes('left') ? name.replace('left', 'right') : name.replace('right', 'left'))

/* Free options
const texturePackerOptions =
  '--extrude 0 --algorithm Basic --png-opt-level 0 --disable-auto-alias --trim-mode None'
*/
const texturePackerOptions = ''

if (!fs.existsSync(inputFolder)) {
  console.error(`  ${chalk.red('Could not find input folder')} ${chalk.blue(inputFolder)}. ${chalk.red('Did you misspell it?')}`)
  process.exit(1)
}

try {
  processFolder(inputFolder)

  const result = execSync(`texturepacker --data ${outputFile}.json --format json --sheet ${outputFile}.png ${texturePackerOptions} ${exportFolder}`)
  console.log()
  console.log(`  ${chalk.green('Sprite sheet created!')}`)

  console.log()
  console.log(`  ${chalk.blue(piskelFilesMunched)} .piskel file(s) munched`)
  console.log(`  ${chalk.blue(pngFilesMunched)} .png file(s) munched`)

  clearFolder(tmpObj.name)
  tmpObj.removeCallback()

  console.log()
  // * Log output from texture packer
  const outputRows = result.toString().split('\n')
  outputRows.forEach((row) => {
    console.log(`  ${row}`)
  })
} catch (error) {
  // * Don't log the error since error is already displayed by Texture packer
  // TODO: Add flag --verbose
  // console.error('muncher error: ', error)
  process.exit(1)
}

function processFolder(folder) {
  fs.readdirSync(folder).forEach((file) => {
    if (fs.statSync(path.join(folder, file)).isDirectory()) {
      processFolder(`${folder}/${file}/`)
    } else if (file.endsWith('.piskel')) {
      piskelFilesMunched += 1
      piskelToPNG(folder, file)
    } else if (file.endsWith('.png')) {
      pngFilesMunched += 1
      const foldername = folder.replace(inputFolder, '')
      const targetFolder = createFolder(path.join(exportFolder, foldername))
      fs.copyFileSync(path.join(folder, file), path.join(targetFolder, file))

      const name = file.slice(0, -4)
      if (shouldFlip(name)) {
        const outputFileName = flipFileName(file)
        const targetFile = path.join(targetFolder, outputFileName)
        const command = `magick convert ${inputFolder}/${name}.png -flop ${targetFile}`
        execSync(command)
      }
    }
  })
}

function piskelToPNG(folder, file) {
  const data = JSON.parse(fs.readFileSync(`${folder}/${file}`, 'UTF-8'))
  const { height, width } = data.piskel
  const name = file.slice(0, -7)
  const layers = getLayerData(data)
  const foldername = folder.replace(inputFolder, '')

  writeLayersToFiles(layers)
  mergeLayers(layers, name)
  splitFrames({
    height,
    width,
    foldername,
    inputFile: name,
    outputFileName: name,
  })
  // If the file name includes left or right:
  // Generate a copy of the file that is flipped horizontally.
  if (shouldFlip(name)) {
    const outputFileName = flipFileName(name)
    splitFrames({
      height,
      width,
      foldername,
      inputFile: name,
      outputFileName,
      flip: true,
    })
  }
}


function clearFolder(folder) {
  fs.readdirSync(folder).forEach((item) => {
    if (fs.statSync(path.join(folder, item)).isDirectory()) {
      clearFolder(path.join(folder, item))
      fs.rmdirSync(path.join(folder, item))
    } else if (item.endsWith('.png')) {
      fs.unlinkSync(path.join(folder, item))
    }
  })
}


function splitFrames({
  height, width, inputFile, outputFileName, flip = false, foldername,
}) {
  const targetFolder = createFolder(path.join(exportFolder, foldername))
  const targetFile = path.join(targetFolder, `${outputFileName}-%01d.png`)
  const flop = flip ? '-flop' : ''
  const command = `magick convert ${tempFolder}${inputFile}.png -crop ${width}x${height} ${flop} ${targetFile}`
  execSync(command)
}


function mergeLayers(layers, name) {
  if (layers.length > 1) {
    const layerList = layers.reduce((text, layer) => `${text} ${tempFolder}${layer.name}`, '')
    const command = `magick convert -background transparent -flatten ${layerList} ${tempFolder}${name}.png`
    execSync(command)
  } else {
    const filename = `${layers[0].name}`
    fs.renameSync(tempFolder + filename, `${tempFolder}${name}.png`)
  }
}


function writeLayersToFiles(layers) {
  layers.forEach((layer) => {
    fs.writeFileSync(tempFolder + layer.name, layer.png)
    if (layer.opacity !== 1) {
      applyOpacity(tempFolder + layer.name, layer.opacity)
    }
  })
}


function applyOpacity(filename, opacity) {
  execSync(`magick convert -alpha on -channel a -evaluate multiply ${opacity} ${filename} ${filename}`)
}


function getLayerData(data) {
  return data.piskel.layers.map((layerJSON, index) => {
    const layer = JSON.parse(layerJSON)
    const b64png = layer.chunks[0].base64PNG.split(',', 2)[1]
    const png = Buffer.from(b64png, 'base64')
    return {
      index,
      opacity: layer.opacity,
      png,
      name: `${index}.png`,
    }
  })
}

function createFolder(folder) {
  try {
    fs.mkdirSync(folder)
  } catch (e) {
    // pass
  }
  return folder
}
