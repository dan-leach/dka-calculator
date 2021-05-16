window = this;

document = { createElementNS: function () { return {}; } };

importScripts('../../externalDependencies/pdfmake/pdfmake.min.js');
importScripts('../../externalDependencies/pdfmake/vfs_fonts.js');
importScripts('../../externalDependencies/moment/moment.min.js');
importScripts('../../js-1.1.9/submitComponents/imageStore.js');
importScripts('../../js-1.1.9/submitComponents/documentVariables.js');
importScripts('../../js-1.1.9/submitComponents/documentDefinition.js');

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
  const documentVariables = getDocumentVariables(inputs); //perfoms the calculations to derive the variables printed into the document and set positions of dynamic indicator boxes
  const documentDefinition = getDocumentDefinition(inputs, documentVariables);
  console.log('webWorker: documentDefinition generated...');
  pdfMake.createPdf(documentDefinition).getBlob(callback);
  console.log('webWorker: document blob returned...');
}