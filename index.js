#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const { execSync } = require('child_process')
const fs = require('fs')
const tmp = require('tmp')
const { argv } = require('yargs')

const inputFolder = argv.input
const outputFile = argv.output
const flipEnabled = argv.flip

let pngFilesMunched = 0
let piskelFilesMunched = 0

if (!inputFolder) {
  console.error(chalk.red('No input folder specified, use the flag "--input '))
  process.exit(1)
}

if (!outputFile) {
  console.error(chalk.red('No output file specified, use the flag "--output"'))
  process.exit(1)
}

const tmpObj = tmp.dirSync({ unsafeCleanup: false })
const tempFolder = createFolder(path.join(tmpObj.name, 'temp/'))
const exportFolder = createFolder(path.join(tmpObj.name, 'export/'))

/* Free options
const texturePackerOptions =
  '--extrude 0 --algorithm Basic --png-opt-level 0 --disable-auto-alias --trim-mode None'
*/
const texturePackerOptions = ''

if (!fs.existsSync(inputFolder)) {
  console.error(`${chalk.red('Could not find input folder')} ${chalk.blue(inputFolder)}. ${chalk.red('Did you misspell it?')}`)
  process.exit(1)
}

try {
  processFolder(inputFolder)

  const result = execSync(`texturepacker --data ${outputFile}.json --format json --sheet ${outputFile}.png ${texturePackerOptions} ${exportFolder}`)
  console.log()
  console.log(`${chalk.green('Sprite sheet created!')}`)

  console.log()
  console.log(`${piskelFilesMunched} .piskel files munched`)
  console.log(`${pngFilesMunched} .png files munched`)

  clearFolder(tmpObj.name)
  tmpObj.removeCallback()

  console.log()
  // * Log output from texture packer
  console.log(result.toString())
} catch (error) {
  // * Don't log the error since error is already displayed by Texture packer
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
    }
  })
}


function piskelToPNG(folder, file) {
  const data = JSON.parse(fs.readFileSync(`${folder}/${file}`, 'UTF-8'))
  const { height, width } = data.piskel
  const name = file.slice(0, -7)
  const layers = getLayerData(data)
  const foldername = folder.replace(inputFolder, '')

  writeLayersToFiles(layers, name)
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
  if ((name.includes('left') || name.includes('right')) && flipEnabled) {
    const outputFileName = name.includes('left') ? name.replace('left', 'right') : name.replace('right', 'left')
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
  height, width, inputFile, outputFileName, flip, foldername,
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
