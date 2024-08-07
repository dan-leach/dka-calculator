import { getDocDef } from "@/assets/docDef.js";
import pdfMake from "pdfmake/build/pdfmake.js";
import pdfFonts from "@/assets/pdfFonts";

// Error handler function to post messages containing error objects to the main thread.
function errHandler(e) {
  console.error("Error in webWorker.js: ", e);
  postMessage(e);
}

// Message handler triggered from the main thread to start PDF blob generation
onmessage = function (req) {
  console.log("webWorker: request received...");
  new Promise(function (resolve, reject) {
    generatePdfBlob(req.data, function (result) {
      if (result) {
        resolve(result);
      } else {
        reject(new Error("Failed to generate PDF blob"));
      }
    });
  })
    .then(function (pdfBlob) {
      postMessage({ pdfBlob }); // Return the PDF blob to the main thread
    })
    .catch(errHandler); // Handle any errors that occur during the promise execution
};

/**
 * Generates a PDF document blob given input data.
 * @param {Object} req - The request data for PDF generation.
 * @param {Function} callback - The callback function to handle the generated blob.
 */
function generatePdfBlob(req, callback) {
  try {
    if (!callback)
      throw new Error(
        "generatePdfBlob is an async method and needs a callback"
      );

    // Generate the document definition using inputs and document variables
    const docDef = getDocDef(req);
    console.log("webWorker: docDef generated...", docDef);

    pdfMake.vfs = pdfFonts; // Set the virtual file system for fonts
    pdfMake.createPdf(docDef).getBlob(callback); // Create the PDF and get the blob
    console.log("webWorker: document blob returned...");
  } catch (e) {
    errHandler(e); // Handle errors using the proxy errHandler within the web worker
  }
}

//main thread waits for ready signal as imports for this module can be slow
postMessage({ type: "ready" });
