/*
  File: downloadDocument.js
  Description: This file contains a single function to download a file given
  it's key.
*/

import { publicAxios } from '../config/axiosInstance.js';

async function downloadDocument(key, fileName) {
  // retrieve the `get` url of the document.
  const res = await publicAxios.get(`/file/s3-url-get?key=${key}`);
  const { url } = res.data;

  // download the document as blob
  const fileResponse = await publicAxios.get(url, { responseType: 'blob' });

  const blobUrl = window.URL.createObjectURL(new Blob([fileResponse.data]));

  // Create a download link
  const a = document.createElement('a');
  a.href = blobUrl;
  a.target = '_blank';
  a.download = fileName;

  // Append the link to the body and trigger a click
  document.body.appendChild(a);
  a.click();

  // Remove the link from the body
  document.body.removeChild(a);
}

export default downloadDocument;
