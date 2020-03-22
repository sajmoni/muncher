/**
 * @param {string} filePath
 */
const getFolderPath = (filePath) =>
  filePath.substring(0, filePath.lastIndexOf('/'))
/**
 * @param {string} filePath
 */
const getFileName = (filePath) =>
  filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'))

// TODO: Only check for left and right and the end of the file name
// * Add a file with left in the middle to test this
/**
 * @param {string} name
 */
const shouldFlip = (name) => name.includes('left') || name.includes('right')

// TODO: Make sure that only "left" and "right" at the end of the file name is replaced
/**
 * @param {string} name
 */
const flipFileName = (name) =>
  name.includes('left')
    ? name.replace('left', 'right')
    : name.replace('right', 'left')

/**
 * @param {string} folderPath
 */
const removeInitialFolderFromPath = (folderPath) => {
  if (!folderPath.includes('/')) {
    return ''
  }
  return folderPath.substring(folderPath.indexOf('/') + 1, folderPath.length)
}

module.exports = {
  getFolderPath,
  getFileName,
  shouldFlip,
  flipFileName,
  removeInitialFolderFromPath,
}
