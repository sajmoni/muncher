const fs = require('fs')
const path = require('path')

const PISKEL = 'piskel'
const PNG = 'png'
const VALID_FILES = [PISKEL, PNG]

/**
 * @param {import("fs").PathLike} directory
 */
// @ts-ignore
const getFileNames = (directory) => {
  /**
   * @param {string} file
   */
  return fs.readdirSync(directory).flatMap((file) => {
    // @ts-ignore
    const fullPath = path.join(directory, file)
    if (fs.lstatSync(fullPath).isDirectory()) {
      return getFileNames(fullPath)
    }
    return fullPath
  })
}

/**
 * @param {string} fileName
 */
const isValidFile = (fileName) =>
  VALID_FILES.some((valid) => fileName.endsWith(valid))

/**
 * @param {string} directory
 */
const getValidFileNames = (directory) =>
  getFileNames(directory).filter(isValidFile)

module.exports = getValidFileNames
