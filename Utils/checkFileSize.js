/*
Filename: checkFileSize.js
Description: A utility function to check the file size and give boolean output if file size is more than 5MB.
*/

const checkFileSize = (uploadedFile) => {
  if (uploadedFile.size > 5 * 1024 * 1024) {
    // Display an error message or take the appropriate action
    return false;
  }
  return true;
};

export default checkFileSize;
