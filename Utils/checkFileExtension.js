'use client';
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
