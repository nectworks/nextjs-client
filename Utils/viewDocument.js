/*
   File: viewdocument.js
   Description: This file contains a function that takes file's key
   as a parameter and fetches a signed URL to access it. It opens the
   document in the new tab.
*/

import { publicAxios } from '../config/axiosInstance.js';
import showBottomMessage from './showBottomMessage';

// function to get signed url for accessing a document
async function viewDocumentInNewTab(key) {
  try {
    const res = await publicAxios.get(`/file/s3-url-get?key=${key}`);

    const { url } = res.data;

    /* if the signed url is successfully generated, view
         the document in new tab */
    if (res.status === 200) {
      window.open(url);
    } else {
      showBottomMessage(`Couldn't view document.`);
    }
  } catch (error) {
    showBottomMessage(`Couldn't view document.`);
  }
}

export default viewDocumentInNewTab;
