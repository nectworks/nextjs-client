/*
Filename: checkFileExtension.js
Description: A utility function for validating file extensions based on file type, used for checking uploaded files against allowed extensions.
*/

const checkFileExtension = (uploadedFile, isDocument) => {
  let allowedExtensions = [];

  if (isDocument) {
    const documentExtensions = ['pdf'];
    allowedExtensions = documentExtensions;
  } else {
    const imgExtensions = ['jpg', 'jpeg', 'png'];
    allowedExtensions = imgExtensions;
  }

  const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

  if (allowedExtensions.includes(fileExtension)) {
    return true;
  }
  return false;
};

export default checkFileExtension;
