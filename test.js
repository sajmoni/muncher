const test = require('ava')

const {
  getFolderPath,
  getFileName,
  shouldFlip,
  flipFileName,
  removeInputFolderFromPath,
} = require('./src/util')

const fullPath1 = 'sprites/hello.png'
const fullPath2 = 'sprites/subfolder/hello.png'
const fullPathFlip = 'sprites/subfolder/hello-right.png'

test('getFolderPath', t => {
  t.is(getFolderPath(fullPath1), 'sprites')
  t.is(getFolderPath(fullPath2), 'sprites/subfolder')
})

test('getFileName', t => {
  t.is(getFileName(fullPath1), 'hello')
  t.is(getFileName(fullPath2), 'hello')
})

test('shouldFlip', t => {
  t.is(shouldFlip(fullPath2), false)
  t.is(shouldFlip(fullPathFlip), true)
})

test('flipFileName', t => {
  t.is(flipFileName(getFileName(fullPath2)), 'hello')
  t.is(flipFileName(getFileName(fullPathFlip)), 'hello-left')
})

test('removeInitialFolderFromPath', t => {
  const inputFolder = 'asset/sprite'
  const fullSourcePath1 = 'asset/sprite/hello.png'
  const fullSourcePath2 = 'asset/sprite/subfolder/hello.png'
  t.is(removeInputFolderFromPath(inputFolder, getFolderPath(fullSourcePath1)), '')
  t.is(removeInputFolderFromPath(inputFolder, getFolderPath(fullSourcePath2)), '/subfolder')
})
