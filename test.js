const test = require('ava')

const {
  getFolderPath,
  getFileName,
  shouldFlip,
  flipFileName,
  removeInitialFolderFromPath,
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
  t.is(removeInitialFolderFromPath(getFolderPath(fullPath1)), '')
  t.is(removeInitialFolderFromPath(getFolderPath(fullPath2)), 'subfolder')
  t.is(removeInitialFolderFromPath(fullPath2), 'subfolder/hello.png')
})
