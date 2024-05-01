import { getDocDef } from "@/assets/docDef.js";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "@/assets/pdfFonts";

function errHandler(e) {
  //posts a message containing the error object to be handled on the main thread
  console.log("Error in webWorker.js: ", e);
  postMessage(e);
}

onmessage = function (req) {
  //triggered from main thread and starts PDF blob generation
  console.log("webWorker: request received...");
  new Promise(function (resolve, reject) {
    generatePdfBlob(req.data, function (result) {
      if (result) {
        resolve(result);
      } else {
        reject();
      }
    });
  }).then(function (pdfBlob) {
    postMessage({ pdfBlob }); //return the pdf blob to main thread
  });
};

function generatePdfBlob(req, callback) {
  //returns a pdf document blob given inputs
  try {
    if (!callback)
      throw "generatePdfBlob is an async method and needs a callback";
    const docDef = getDocDef(req); //generates the document definition using inputs and documentVariables
    console.log("webWorker: docDef generated...", docDef);
    pdfMake.vfs = pdfFonts;
    pdfMake.createPdf(docDef).getBlob(callback);
    console.log("webWorker: document blob returned...");
  } catch (e) {
    errHandler(e); //refers to the proxy errHandler within webWorker
  }
}
