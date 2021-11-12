window = this;

document = { createElementNS: function () { return {}; } };

importScripts('/externalDependencies/pdfmake/pdfmake.min.js');
importScripts('/externalDependencies/pdfmake/vfs_fonts.js');
importScripts('/externalDependencies/moment/moment.min.js');
importScripts('imageStore.js');
importScripts('calcVars.js');
importScripts('docDef.js');

onmessage = function(req) {
  console.log('webWorker: request received...');
  new Promise(function (resolve, reject) {
    generatePdfBlob(req.data, function (result) {
      if (result) { resolve(result); } else { reject(); }
    });
  }).then(function (pdfBlob) {
    postMessage({ pdfBlob });
  });
};

function generatePdfBlob(inputs, callback) {
  if (!callback) {
    console.log('generatePdfBlob is an async method and needs a callback');
  }
  const calcVars = getCalcVars(inputs); //perfoms the calculations to derive the variables printed into the document and set positions of dynamic indicator boxes
  const docDef = getDocDef(inputs, calcVars);
  console.log('webWorker: docDef generated...');
  pdfMake.createPdf(docDef).getBlob(callback);
  console.log('webWorker: document blob returned...');
}
