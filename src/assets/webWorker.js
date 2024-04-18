
window = this;

document = { createElementNS: function () { return {}; } };

importScripts('/externalDependencies/pdfmake/pdfmake.min.js'); //required for PDF generation
importScripts('/externalDependencies/pdfmake/vfs_fonts.js'); //required for PDF generation
importScripts('/externalDependencies/moment/moment.min.js'); //required for calcVars and docDef
importScripts('../settings.js');
importScripts('imageStore.js');
importScripts('calcVars.js');
importScripts('docDef.js');

function errHandler(e){ //posts a message containing the error object to be handled by errHandler on the main thread
  console.log('Error in webWorker.js: ', e);
  postMessage(e);
}

onmessage = function(req) { //receives inputs from main thread and triggers PDF blob generation
  console.log('webWorker: request received...');
  new Promise(function (resolve, reject) {
    generatePdfBlob(req.data, function (result) {
      if (result) { resolve(result); } else { reject(); }
    });
  }).then(function (pdfBlob) {
    postMessage({ pdfBlob }); //return the pdf blob to main thread
  });
};

function generatePdfBlob(inputs, callback) { //returns a pdf document blob given inputs
  try{
    if (!callback) throw 'generatePdfBlob is an async method and needs a callback';
    const calcVars = getCalcVars(inputs); //perfoms the calculations to derive the variables printed into the document and set positions of dynamic indicator boxes
    const docDef = getDocDef(inputs, calcVars);
    console.log('webWorker: docDef generated...');
    pdfMake.createPdf(docDef).getBlob(callback);
    console.log('webWorker: document blob returned...');
  } catch (e) {
    errHandler(e); //refers to the proxy errHandler within webWorker
  }
}