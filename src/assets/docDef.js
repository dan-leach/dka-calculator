import { config } from "./config.js";
import { imageStore } from "./imageStore.js";

const indicatorCoordinates = {
  //functions that return the variable coordinates for indicator boxes on the protocol document
  xAxisShock: function (req) {
    //returns x-axis coordinate for the indicator box showing if patient is shocked or not
    if (req.shockPresent)
      return config.client.indicatorCoordinates.xAxisShock.yes;
    return config.client.indicatorCoordinates.xAxisShock.no;
  },
  yAxisSeverity: function (req) {
    //returns y-axis coordinate for the indicator box showing severity of DKA
    if (req.calculations.severity == "severe")
      return config.client.indicatorCoordinates.yAxisSeverity.severe;
    if (req.calculations.severity == "moderate")
      return config.client.indicatorCoordinates.yAxisSeverity.moderate;
    if (req.calculations.severity == "mild")
      return config.client.indicatorCoordinates.yAxisSeverity.mild;
    throw new Error("Unable to select yAxisSeverity");
  },
  xAxisDiabetic: function (req) {
    //returns x-axis coordinate for the indicator box showing if patient had pre-existing diabetes
    if (req.preExistingDiabetes)
      return config.client.indicatorCoordinates.xAxisDiabetic.yes;
    return config.client.indicatorCoordinates.xAxisDiabetic.no;
  },
};

const capAlert = {
  //if a calculated variable is capped, returns asterisks and message to appear on protocol
  bolus: {
    asterisk: function (req) {
      //asterisk for capped bolus
      if (req.calculations.bolus.isCapped) return "*";
      return "";
    },
    message: function (req) {
      //message for capped bolus
      if (req.calculations.bolus.isCapped)
        return (
          "*Bolus capped to 10mL/kg for " +
          config.value.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  deficit: {
    asterisk: function (req) {
      //asterisk for capped deficit
      if (req.calculations.deficit.isCapped) return "*";
    },
    message: function (req) {
      //message for capped deficit
      if (req.calculations.deficit.isCapped)
        return (
          "*Deficit capped to volume for " +
          config.value.weightLimits.max +
          "kg with " +
          req.calculations.deficit.percentage +
          "% dehydration."
        );
      return "";
    },
  },
  maintenance: {
    asterisk: function (req) {
      //asterisk for capped maintenance
      if (req.calculations.maintenance.isCapped) return "*";
    },
    message: function (req) {
      //message for capped maintenance
      if (req.calculations.maintenance.isCapped)
        return (
          "*Maintenance capped to volume for " +
          config.value.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  insulin: {
    asterisk: function (req) {
      //asterisk for capped insulin
      if (req.calculations.insulin.isCapped) return "*";
    },
    message: function (req) {
      //message for capped insulin
      if (req.calculations.insulin.isCapped)
        return (
          "*Insulin rate capped to " +
          req.inputs.insulinRate +
          " Units/kg/hour for " +
          config.value.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
};

const datetimes = {
  protocolStart: {
    time: function (str) {
      let protocolStartDatetime = new Date(str);
      let output =
        (protocolStartDatetime.getHours() < 10 ? "0" : "") +
        protocolStartDatetime.getHours();
      output +=
        ":" +
        (protocolStartDatetime.getMinutes() < 10 ? "0" : "") +
        protocolStartDatetime.getMinutes();
      return output;
    },
    date: function (str) {
      let protocolStartDatetime = new Date(str);
      let output =
        (protocolStartDatetime.getDate() < 10 ? "0" : "") +
        protocolStartDatetime.getDate();
      output +=
        "/" +
        (protocolStartDatetime.getMonth() < 9 ? "0" : "") +
        (protocolStartDatetime.getMonth() + 1);
      output += "/" + protocolStartDatetime.getFullYear();
      return output;
    },
  },
  serialReview: {
    time: function (req, h) {
      let dt = new Date(req.protocolStartDatetime);
      dt.setTime(dt.getTime() + h * 60 * 60 * 1000);
      let output = (dt.getHours() < 10 ? "0" : "") + dt.getHours();
      output += ":" + (dt.getMinutes() < 10 ? "0" : "") + dt.getMinutes();
      return output;
    },
    date: function (req, h) {
      let dt = new Date(req.protocolStartDatetime);
      dt.setTime(dt.getTime() + h * 60 * 60 * 1000);
      let output = (dt.getDate() < 10 ? "0" : "") + dt.getDate();
      output += "/" + (dt.getMonth() < 9 ? "0" : "") + (dt.getMonth() + 1);
      output += "/" + dt.getFullYear();
      return output;
    },
  },
  generated: function () {
    let now = new Date();
    let output = (now.getHours() < 10 ? "0" : "") + now.getHours();
    output += ":" + (now.getMinutes() < 10 ? "0" : "") + now.getMinutes();
    output += " " + (now.getDate() < 10 ? "0" : "") + now.getDate();
    output += "/" + (now.getMonth() < 9 ? "0" : "") + (now.getMonth() + 1);
    output += "/" + now.getFullYear();
    return output;
  },
  dob: function (str) {
    let dob = new Date(str);
    let output = (dob.getDate() < 10 ? "0" : "") + dob.getDate();
    output += "/" + (dob.getMonth() < 9 ? "0" : "") + (dob.getMonth() + 1);
    output += "/" + dob.getFullYear();
    return output;
  },
};

const hospNHSNumber = (req) => {
  return req.patientNHS
    ? "NHS number: " + req.patientNHS
    : "Hospital number: " + req.patientHospNum;
};

function getDocDef(req) {
  const docDef = {
    pageSize: "A4",
    pageOrientation: "portrait",
    pageMargins: [0, 50, 0, 40], // [left, top, right, bottom]

    styles: {
      header: {
        //for the patient demographics etc at the top of each page
        fontSize: 10,
      },
      timing: {
        //for the datetime stamps on the serial data table
        fontSize: 8,
        color: "grey",
      },
      table: {
        //for the GCS and estimated weight tables
        fontSize: 10,
        alignment: "center",
      },
      heading: {
        //for the section headings in the appedncies
        fontSize: 12,
        bold: true,
      },
      appendix: {
        //for the appendicies body text
        fontSize: 10,
      },
    },

    watermark: {
      text: "DKA Calculator Development Version - Not for clinical use",
      color: "red",
      opacity: 0.3,
      bold: true,
      italics: false,
    },

    header: function (currentPage, pageCount) {
      // adds demographic, page number, generation datetime stamp and calculator URL to all headers except title page
      if (currentPage == 1) {
        return "";
      } else {
        return {
          table: {
            widths: ["2%", "33%", "30%", "33%", "2%"],
            body: [
              [
                { text: "" },
                {
                  text: "Name: " + req.patientName,
                  alignment: "left",
                  style: "header",
                },
                {
                  text:
                    config.url.replace("https://", "") +
                    " (v" +
                    config.version +
                    ")",
                  alignment: "center",
                  style: "header",
                },
                {
                  text: "Protocol page " + currentPage + " of " + pageCount,
                  alignment: "right",
                  style: "header",
                },
                { text: "" },
              ],
              [
                { text: "" },
                {
                  text: "Date of birth: " + datetimes.dob(req.patientDOB),
                  alignment: "left",
                  style: "header",
                },
                { text: "" },
                {
                  text: "Audit ID: " + req.auditID,
                  alignment: "right",
                  style: "header",
                },
                { text: "" },
              ],
              [
                { text: "" },
                {
                  text: hospNHSNumber(req),
                  alignment: "left",
                  style: "header",
                },
                { text: "" },
                {
                  text:
                    "Protocol start: " +
                    datetimes.protocolStart.time(req.protocolStartDatetime) +
                    " " +
                    datetimes.protocolStart.date(req.protocolStartDatetime),
                  alignment: "right",
                  style: "header",
                },
                { text: "" },
              ],
            ],
          },
          layout: "noBorders",
        };
      }
    },

    images: {
      //retrieves images from imageStore.js
      page1: imageStore.titlePage,
      page2: imageStore.introductoryNotes,
      page3: imageStore.flowChart1,
      page4: imageStore.flowChart2,
      page5: imageStore.flowChart3,
      page6: imageStore.flowChart4,
      page7: imageStore.flowChart5,
      page8: imageStore.flowChart6,
      page9: imageStore.flowChart7,
      page10: imageStore.table1,
      page11: imageStore.flowChart89,
      page12: imageStore.flowChart1011,
      page13: imageStore.flowChart12,
      page14: imageStore.appendixBG,
      equation1: imageStore.equation1,
      equation2: imageStore.equation2,
      equation3: imageStore.equation3,
      equation4: imageStore.equation4,
    },

    background: function (currentPage, pageSize) {
      //places protocol images onto each page, fitted to size
      if (currentPage == 1) {
        return [{ image: "page1", width: pageSize.width }];
      }
      if (currentPage == 2) {
        return [{ image: "page2", width: pageSize.width }];
      }
      if (currentPage == 3) {
        return [{ image: "page3", width: pageSize.width }];
      }
      if (currentPage == 4) {
        return [{ image: "page4", width: pageSize.width }];
      }
      if (currentPage == 5) {
        return [{ image: "page5", width: pageSize.width }];
      }
      if (currentPage == 6) {
        return [{ image: "page6", width: pageSize.width }];
      }
      if (currentPage == 7) {
        return [{ image: "page7", width: pageSize.width }];
      }
      if (currentPage == 8) {
        return [{ image: "page8", width: pageSize.width }];
      }
      if (currentPage == 9) {
        return [{ image: "page9", width: pageSize.width }];
      }
      if (currentPage == 10) {
        return [{ image: "page10", width: pageSize.width }];
      }
      if (currentPage == 11) {
        return [{ image: "page11", width: pageSize.width }];
      }
      if (currentPage == 12) {
        return [{ image: "page12", width: pageSize.width }];
      }
      if (currentPage == 13) {
        return [{ image: "page13", width: pageSize.width }];
      }
      if (currentPage == 14) {
        return [{ image: "page14", width: pageSize.width }];
      }
      if (currentPage == 15) {
        return [{ image: "page14", width: pageSize.width }];
      }
      if (currentPage == 16) {
        return [{ image: "page14", width: pageSize.width }];
      }
    },

    content: [
      // variables added over top of protocol images, and text for appendicies
      //page 1
      //patient demographics box
      {
        text: "Name: " + req.patientName,
        fontSize: 12,
        absolutePosition: { x: 60, y: 306 },
      },
      {
        text: "Date of birth: " + datetimes.dob(req.patientDOB),
        fontSize: 12,
        absolutePosition: { x: 60, y: 324 },
      },
      {
        text: hospNHSNumber(req),
        fontSize: 12,
        absolutePosition: { x: 60, y: 342 },
      },
      {
        text: "Audit ID: " + req.auditID,
        fontSize: 12,
        absolutePosition: { x: 60, y: 360 },
      },
      {
        text: "Generated: " + datetimes.generated(),
        fontSize: 12,
        absolutePosition: { x: 60, y: 378 },
      },
      //Protocol start datetime box
      {
        text: datetimes.protocolStart.time(req.protocolStartDatetime),
        fontSize: 12,
        absolutePosition: { x: 410, y: 328 },
      },
      {
        text: datetimes.protocolStart.date(req.protocolStartDatetime),
        fontSize: 12,
        absolutePosition: { x: 400, y: 372 },
      },
      //calculator input check box
      {
        text:
          "This protocol was generated at " +
          config.url.replace("https://", "") +
          " and certain elements of the document, such as fluid",
        link: config.url,
        fontSize: 10,
        absolutePosition: { x: 65, y: 645 },
      },
      {
        text: "calculations have been pre-filled. The following values were used and should be checked for accuracy before",
        link: config.url,
        fontSize: 10,
        absolutePosition: { x: 65, y: 661 },
      },
      {
        text: "using this protocol. Please read the disclaimer at the end of this document before use.",
        fontSize: 10,
        absolutePosition: { x: 65, y: 677 },
      },
      {
        text:
          "Weight: " +
          req.weight +
          "kg (Weight safety limit override? " +
          req.override +
          ")",
        fontSize: 10,
        absolutePosition: { x: 65, y: 709 },
      },
      {
        text:
          "pH: " +
          req.pH +
          (req.bicarbonate
            ? "     Bicarbonate: " + req.bicarbonate + "mmol/L"
            : ""),
        fontSize: 10,
        absolutePosition: { x: 325, y: 709 },
      },
      {
        text: "Patient clinically shocked? " + req.shockPresent,
        fontSize: 10,
        absolutePosition: { x: 65, y: 725 },
      },
      {
        text:
          "Starting insulin infusion rate: " +
          req.insulinRate +
          " Units/kg/hour",
        fontSize: 10,
        absolutePosition: { x: 325, y: 725 },
      },
      {
        text: "Pre-existing diabetes? " + req.preExistingDiabetes,
        fontSize: 10,
        absolutePosition: { x: 65, y: 741 },
      },
      {
        text: "Sex: " + req.patientSex,
        fontSize: 10,
        absolutePosition: { x: 325, y: 741 },
      },
      {
        text: config.bsped.dkaGuidelines,
        link: config.bsped.dkaGuidelines,
        fontSize: 10,
        absolutePosition: { x: 250, y: 530 },
        pageBreak: "after",
      },
      //page 2
      {
        text: "",
        pageBreak: "after",
      },
      //page 3
      //record initial values box
      {
        text: req.glucose,
        fontSize: 12,
        absolutePosition: { x: 222, y: 219 },
      },
      {
        text: req.pH,
        fontSize: 12,
        absolutePosition: { x: 222, y: 247 },
      },
      {
        text: req.ketones,
        fontSize: 12,
        absolutePosition: { x: 222, y: 275 },
      },
      {
        text: req.bicarbonate,
        fontSize: 12,
        absolutePosition: { x: 222, y: 302 },
        pageBreak: "after",
      },
      //page 4
      {
        //Is patient shocked yes/no indicator box
        canvas: [
          {
            type: "rect",
            x: indicatorCoordinates.xAxisShock(req),
            y: 332,
            w: 40,
            h: 40,
            lineColor: "#00ff2e",
            lineWidth: 10,
          },
        ],
      },
      {
        //patient weight box
        text: req.weight,
        fontSize: 18,
        absolutePosition: { x: 287, y: 240 },
      },
      // bolus volumes
      //1st 10ml/kg resus bolus
      {
        text: req.calculations.bolus.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 95, y: 453 },
      },
      //* if bolus capped
      {
        text: capAlert.bolus.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 128, y: 453 },
        color: "red",
      },
      //2nd 10ml/kg resus bolus
      {
        text: req.calculations.bolus.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 95, y: 538 },
      },
      {
        text: capAlert.bolus.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 128, y: 538 },
        color: "red",
      },
      //3rd 10ml/kg resus bolus
      {
        text: req.calculations.bolus.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 95, y: 568 },
      },
      {
        text: capAlert.bolus.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 128, y: 568 },
        color: "red",
      },
      //4th 10ml/kg resus bolus
      {
        text: req.calculations.bolus.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 95, y: 598 },
      },
      {
        text: capAlert.bolus.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 128, y: 598 },
        color: "red",
      },
      //10ml/kg slow bolus - non-shocked arm
      {
        text: req.calculations.bolus.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 375, y: 462 },
      },
      {
        text: capAlert.bolus.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 408, y: 462 },
        color: "red",
      },
      {
        text: capAlert.bolus.message(req),
        fontSize: 14,
        absolutePosition: { x: 40, y: 640 },
        color: "red",
        pageBreak: "after",
      },
      //page 5
      {
        text: "",
        pageBreak: "after",
      },
      //page 6
      {
        //DKA severity indicator box
        canvas: [
          {
            type: "rect",
            x: 190,
            y: indicatorCoordinates.yAxisSeverity(req),
            w: 170,
            h: 40,
            lineColor: "#00ff2e",
            lineWidth: 10,
          },
        ],
      },
      //fluid deficit
      {
        text: req.weight,
        fontSize: 18,
        absolutePosition: { x: 170, y: 280 },
      },
      {
        text: req.calculations.deficit.percentage,
        fontSize: 18,
        absolutePosition: { x: 310, y: 280 },
      },
      {
        text: req.calculations.deficit.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 430, y: 280 },
      },
      {
        text: capAlert.deficit.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 470, y: 280 },
        color: "red",
      },
      {
        text: capAlert.deficit.message(req),
        fontSize: 14,
        absolutePosition: { x: 200, y: 322 },
        color: "red",
      },
      //fluid deficit (less bolus volume)
      {
        text: req.calculations.deficit.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 170, y: 390 },
      },
      {
        text: req.calculations.deficit.bolusToSubtract.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 300, y: 390 },
      },
      {
        text: req.calculations.deficit.volumeLessBolus.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 430, y: 390 },
      },
      //deficit replacement rate
      {
        text: req.calculations.deficit.volumeLessBolus.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 225, y: 470 },
      },
      {
        text: req.calculations.deficit.rate.toFixed(1),
        fontSize: 18,
        absolutePosition: { x: 430, y: 470 },
      },
      //maintenance rate
      {
        text: req.calculations.maintenance.volume.toFixed(),
        fontSize: 18,
        absolutePosition: { x: 185, y: 565 },
      },
      {
        text: capAlert.maintenance.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 225, y: 565 },
        color: "red",
      },
      {
        text: capAlert.maintenance.message(req),
        fontSize: 14,
        absolutePosition: { x: 225, y: 604 },
        color: "red",
      },
      {
        text: req.calculations.maintenance.rate.toFixed(1),
        fontSize: 18,
        absolutePosition: { x: 395, y: 565 },
      },
      //starting fluid rate
      {
        text: req.calculations.maintenance.rate.toFixed(1),
        fontSize: 18,
        absolutePosition: { x: 205, y: 650 },
      },
      {
        text: req.calculations.deficit.rate.toFixed(1),
        fontSize: 18,
        absolutePosition: { x: 330, y: 650 },
      },
      {
        text: req.calculations.startingFluidRate.toFixed(1),
        fontSize: 18,
        absolutePosition: { x: 455, y: 650 },
        pageBreak: "after",
      },
      //page 7
      {
        //Patient has pre-existing diabetes yes/no indicator box
        canvas: [
          {
            type: "rect",
            x: indicatorCoordinates.xAxisDiabetic(req),
            y: 400,
            w: 40,
            h: 40,
            lineColor: "#00ff2e",
            lineWidth: 10,
          },
        ],
      },
      //insulin hourly rate
      {
        text: parseFloat(req.insulinRate),
        fontSize: 18,
        absolutePosition: { x: 170, y: 205 },
      },
      {
        text: req.weight,
        fontSize: 18,
        absolutePosition: { x: 315, y: 205 },
      },
      {
        text: req.calculations.insulin.rate.toFixed(2),
        fontSize: 18,
        absolutePosition: { x: 440, y: 205 },
      },
      {
        text: capAlert.insulin.asterisk(req),
        fontSize: 18,
        absolutePosition: { x: 475, y: 205 },
        color: "red",
      },
      {
        text: capAlert.insulin.message(req),
        fontSize: 14,
        absolutePosition: { x: 230, y: 235 },
        color: "red",
        pageBreak: "after",
      },
      //page 8
      {
        text: "",
        pageBreak: "after",
      },
      //page 9
      {
        text: "",
        pageOrientation: "landscape", //changes orientation for following page
        pageBreak: "after",
      },
      //page 10 - adds time and date for each box on serial data sheet
      {
        text: datetimes.serialReview.time(req, 0),
        style: "timing",
        absolutePosition: { x: 107, y: 86 },
      },
      {
        text: datetimes.serialReview.date(req, 0),
        style: "timing",
        absolutePosition: { x: 97, y: 93 },
      },
      {
        text: datetimes.serialReview.time(req, 2),
        style: "timing",
        absolutePosition: { x: 107, y: 105 },
      },
      {
        text: datetimes.serialReview.date(req, 2),
        style: "timing",
        absolutePosition: { x: 97, y: 112 },
      },
      {
        text: datetimes.serialReview.time(req, 6),
        style: "timing",
        absolutePosition: { x: 107, y: 143 },
      },
      {
        text: datetimes.serialReview.date(req, 6),
        style: "timing",
        absolutePosition: { x: 97, y: 150 },
      },
      {
        text: datetimes.serialReview.time(req, 10),
        style: "timing",
        absolutePosition: { x: 107, y: 181 },
      },
      {
        text: datetimes.serialReview.date(req, 10),
        style: "timing",
        absolutePosition: { x: 97, y: 188 },
      },
      {
        text: datetimes.serialReview.time(req, 14),
        style: "timing",
        absolutePosition: { x: 107, y: 219 },
      },
      {
        text: datetimes.serialReview.date(req, 14),
        style: "timing",
        absolutePosition: { x: 97, y: 226 },
      },
      {
        text: datetimes.serialReview.time(req, 18),
        style: "timing",
        absolutePosition: { x: 107, y: 256 },
      },
      {
        text: datetimes.serialReview.date(req, 18),
        style: "timing",
        absolutePosition: { x: 97, y: 263 },
      },
      {
        text: datetimes.serialReview.time(req, 22),
        style: "timing",
        absolutePosition: { x: 107, y: 294 },
      },
      {
        text: datetimes.serialReview.date(req, 22),
        style: "timing",
        absolutePosition: { x: 97, y: 301 },
      },
      {
        text: datetimes.serialReview.time(req, 26),
        style: "timing",
        absolutePosition: { x: 107, y: 332 },
      },
      {
        text: datetimes.serialReview.date(req, 26),
        style: "timing",
        absolutePosition: { x: 97, y: 339 },
      },
      {
        text: datetimes.serialReview.time(req, 30),
        style: "timing",
        absolutePosition: { x: 107, y: 370 },
      },
      {
        text: datetimes.serialReview.date(req, 30),
        style: "timing",
        absolutePosition: { x: 97, y: 377 },
      },
      {
        text: datetimes.serialReview.time(req, 34),
        style: "timing",
        absolutePosition: { x: 107, y: 407 },
      },
      {
        text: datetimes.serialReview.date(req, 34),
        style: "timing",
        absolutePosition: { x: 97, y: 414 },
      },
      {
        text: datetimes.serialReview.time(req, 38),
        style: "timing",
        absolutePosition: { x: 107, y: 445 },
      },
      {
        text: datetimes.serialReview.date(req, 38),
        style: "timing",
        absolutePosition: { x: 97, y: 452 },
      },
      {
        text: datetimes.serialReview.time(req, 42),
        style: "timing",
        absolutePosition: { x: 107, y: 482 },
      },
      {
        text: datetimes.serialReview.date(req, 42),
        style: "timing",
        absolutePosition: { x: 97, y: 489 },
      },
      {
        text: "",
        pageOrientation: "portrait", //changes orientation for following page
        pageBreak: "after",
      },
      //page 11
      {
        text: "",
        pageBreak: "after",
      },
      //page 12
      {
        text: "",
        pageBreak: "after",
      },
      //page 13
      {
        text: config.ispad,
        link: config.ispad,
        fontSize: 8,
        absolutePosition: { x: 220, y: 675 },
        pageBreak: "after",
      },
      //page 14
      {
        //outer table adds 20px border for whole page
        layout: "noBorders",
        style: "table",
        table: {
          headerRows: 0,
          widths: [20, "*", 20],
          body: [
            [
              "",
              {
                text: "APPENDIX 1 - GLASGOW COMA SCORE",
                style: "heading",
                alignment: "center",
              },
              "",
            ],
            [
              "",
              {
                layout: "noBorders",
                style: "table",
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "*"],
                  body: [
                    ["", "Best Motor Response", "Eye Opening", ""],
                    ["", "1 = none", "1 = none", ""],
                    ["", "2 = extensor response to pain", "2 = to pain", ""],
                    ["", "3 = abnormal flexion to pain", "3 = to speech", ""],
                    ["", "4 = withdraws from pain", "4 = spontaneous", ""],
                    ["", "5 = localises pain", "", ""],
                    ["", "6 = responds to commands", "", ""],
                  ],
                },
              },
              "",
            ],
            ["", " ", ""], //adds a line break
            [
              "",
              {
                layout: "noBorders",
                style: "table",
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "*"],
                  body: [
                    [
                      "",
                      "Best Verbal Response (with modification for younger patients)",
                      "",
                    ],
                  ],
                },
              },
              "",
            ],
            [
              "",
              {
                layout: "noBorders",
                style: "table",
                table: {
                  headerRows: 1,
                  widths: ["auto", "auto", "auto"],
                  body: [
                    [">5 years", "2-5 years", "<2 years"],
                    ["1 = none", "1 = none", "1 = none"],
                    ["2 = incomprehensible sounds", "2 = grunts", "grunts"],
                    [
                      "3 = inappropriate words",
                      "3 = cries or screams",
                      "3 = inappropriate crying or unstimulated screaming",
                    ],
                    [
                      "4 = appropriate words but confused",
                      "4 = monosyllables",
                      "4 = cries only",
                    ],
                    [
                      "5 = fully orientated",
                      "5 = words of any sort",
                      "5 = appropriate non-verbal responses (coos, smiles, cries)",
                    ],
                  ],
                },
              },
              "",
            ],
            ["", " ", ""],
            ["", " ", ""],
            ["", " ", ""],
            [
              "",
              {
                text: "APPENDIX 2 - ESTIMATED WEIGHT TABLE",
                style: "heading",
                alignment: "center",
              },
              "",
            ],
            [
              "",
              {
                layout: "noBorders",
                style: "table",
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "auto", "auto", "*"],
                  body: [
                    [
                      { text: "" },
                      { text: "" },
                      { text: "Guide weight (kg)", colSpan: 2 },
                      { text: "" },
                      { text: "" },
                    ],
                    ["", "Age", "Male", "Female", ""],
                    ["", "6 months", "8", "7", ""],
                    ["", "12 months", "9.5", "9", ""],
                    ["", "18 months", "11", "10", ""],
                    ["", "2 years", "12", "12", ""],
                    ["", "3 years", "14", "14", ""],
                    ["", "4 years", "16", "16", ""],
                    ["", "5 years", "18", "18", ""],
                    ["", "6 years", "21", "20", ""],
                    ["", "7 years", "23", "22", ""],
                    ["", "8 years", "25", "25", ""],
                    ["", "9 years", "28", "28", ""],
                    ["", "10 years", "31", "32", ""],
                    ["", "11 years", "35", "35", ""],
                    ["", "12 years", "43", "43", ""],
                    ["", "14 years", "50", "50", ""],
                    ["", "Adult", "70", "70", ""],
                  ],
                },
              },
              "",
            ],
            [
              "",
              {
                layout: "noBorders",
                style: "table",
                table: {
                  headerRows: 1,
                  widths: ["*", "auto", "*"],
                  body: [
                    [
                      "",
                      {
                        text: "Adapted from Advanced Paediatric Life Support, version 6, 2016",
                        italics: true,
                        bold: true,
                      },
                      "",
                    ],
                  ],
                },
              },
              "",
            ],
          ],
        },
      },
      {
        text: "",
        pageBreak: "after",
      },
      //page 15
      {
        //outer table adds 20px border for whole page
        layout: "noBorders",
        style: "appendix",
        table: {
          headerRows: 0,
          widths: [20, "*", 20],
          body: [
            [
              "",
              {
                text: "APPENDIX 3 - MAKING UP IV FLUIDS",
                style: "heading",
                alignment: "center",
              },
              "",
            ],
            [
              "",
              "The following fluids are generally available from Pharmacy. They may not be available on every ward. If you need to make it up, please do so as below, rather than waiting for pharmacy.",
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "0.9% Sodium Chloride with 5% Glucose and 20 mmol Potassium Chloride in 500mL",
                bold: true,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              "      1. Remove 50mL from a bag of Sodium Chloride 0.9% with 20mmol Potassium Chloride in 500mL",
              "",
            ],
            [
              "",
              "      2. Draw up 50mL of Glucose 50% using a syringe and add to the above bag to make the glucose concentration 5%",
              "",
            ],
            ["", "      3. Mix well before administration", ""],
            ["", " ", ""],
            [
              "",
              {
                text: "0.9% Sodium Chloride with 10% Glucose and 20 mmol Potassium Chloride in 500mL",
                bold: true,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              "      1. Remove 50mL from a bag of Sodium Chloride 0.9% with 5% Glucose and 20mmol Potassium Chloride in 500mL",
              "",
            ],
            [
              "",
              "      2. Draw up 50mL of Glucose 50% using a syringe and add to the above bag to make the glucose concentration 10% ",
              "",
            ],
            ["", "      3. Mix well before administration", ""],
            ["", " ", ""],
            [
              "",
              "Plasmalyte does not contain enough potassium to be used on its own; discuss with pharmacy/PICU before using as maintenance fluid to ensure adequate potassium replacement is provided.",
              "",
            ],
            ["", " ", ""],
            ["", " ", ""],
            [
              "",
              {
                text: "APPENDIX 4 - EXPLANATORY NOTES",
                style: "heading",
                alignment: "center",
              },
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                //this table arrangement required to subscript corr of Nacorr
                layout: {
                  paddingLeft: function (i, node) {
                    return 0;
                  },
                  paddingRight: function (i, node) {
                    return 0;
                  },
                  paddingTop: function (i, node) {
                    return 0;
                  },
                  paddingBottom: function (i, node) {
                    return 0;
                  },
                },
                margin: [0, 0, 0, 0],
                style: "appendix",
                table: {
                  headerRows: 0,
                  widths: ["auto", "auto", "*"],
                  body: [
                    [
                      {
                        text: "Sodium and Corrected Sodium (Na",
                        border: [false, false, false, false],
                        bold: true,
                      },
                      {
                        layout: {
                          paddingLeft: function (i, node) {
                            return 0;
                          },
                          paddingRight: function (i, node) {
                            return 0;
                          },
                          paddingTop: function (i, node) {
                            return 0;
                          },
                          paddingBottom: function (i, node) {
                            return 0;
                          },
                        },
                        margin: [0, 0, 0, 0],
                        style: "appendix",
                        border: [false, false, false, false],
                        table: {
                          headerRows: 0,
                          widths: ["auto"],
                          body: [
                            [
                              {
                                text: " ",
                                fontSize: 3,
                                border: [false, false, false, false],
                                bold: true,
                              },
                            ],
                            [
                              {
                                text: "corr",
                                fontSize: 8,
                                border: [false, false, false, false],
                                bold: true,
                              },
                            ],
                          ],
                        },
                      },
                      {
                        text: ")",
                        border: [false, false, false, false],
                        bold: true,
                      },
                    ],
                  ],
                },
              },
              "",
            ],
            [
              "",
              "Hyponatraemia occurs in DKA as with hyperglycaemia the extracellular osmolality rises resulting in water movement from the intracellular space into extracellular space causing dilution of extracellular sodium and a low serum sodium. However, when glucose begins to fall through hydration and insulin, and the plasma glucose concentration is reduced, water leaves the extracellular space entering intracellular space raising the extracellular sodium concentration again and the serum sodium typically rises. Corrected sodium levels give an indication of the amount of free water in the circulation.",
              "",
            ],
            [
              "",
              "Corrected sodium levels should typically rise as blood glucose levels fall during treatment. It has been suggested that corrected sodium levels give an indication of the risk of cerebral oedema with a falling corrected sodium indicating an excess of free water and an increased risk of cerebral oedema.",
              "",
            ],
            [
              "",
              "If corrected sodium levels fall during treatment, discuss with the consultant on call.",
              "",
            ],
            ["", "The formula for corrected sodium is:", ""],
            [
              "",
              {
                image: "equation1",
                width: 250,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              {
                text:
                  "For worked examples, refer to the full guideline (" +
                  config.bsped.dkaGuidelines.replace("https://", "") +
                  ").",
                link: config.bsped.dkaGuidelines,
              },
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Hyperchloraemic metabolic acidosis",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Hyperchloraemic metabolic acidosis may occur following the administration of large amounts of chloride containing fluids given during the management of DKA. The preferential renal excretion of ketones instead of chloride can result in hyperchloraemia.  The acidifying effect of chloride can mask the resolution of ketoacidosis if base deficit alone is used to monitor progress as there may appear to be a continuing base deficit with a continued low bicarbonate due to the chloride component rather than due to ketosis. Direct monitoring of ketones and calculation of the component of the base deficit due to chloride will help differentiate whether persisting acidosis is due to ongoing ketosis that may need additional treatment (adjustment to insulin infusion or fluids) or due to hyperchloraemia. Acidosis due to hyperchloraemia will correct spontaneously and doesn’t need specific treatment. Acidosis due to hyperchloraemia need not delay the transition to oral fluids and subcutaneous insulin. It needs differentiating from ongoing ketosis.",
              "",
            ],
            ["", " ", ""],
          ],
        },
      },
      {
        text: "",
        pageBreak: "after",
      },
      //page 16
      {
        //outer table adds 20px border for whole page
        layout: "noBorders",
        style: "appendix",
        table: {
          headerRows: 0,
          widths: [20, "*", 20],
          body: [
            [
              "",
              "The formula for calculating the component of the base excess due to chloride is:",
              "",
            ],
            [
              "",
              {
                image: "equation2",
                width: 250,
                alignment: "center",
              },
              "",
            ],
            [
              "",
              {
                text:
                  "For worked examples, refer to the full guideline (" +
                  config.bsped.dkaGuidelines.replace("https://", "") +
                  ").",
                link: config.bsped.dkaGuidelines,
              },
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Albumin",
                bold: true,
              },
              "",
            ],
            [
              "",
              "A low serum albumin can also contribute to a persisting acidosis which may be erroneously attributed to persisting ketosis. Some intensivists also recommend partitioning the component of apparent acidosis due to the reduced albumin to avoid it being inappropriately attributed to persisting ketosis.",
              "",
            ],
            [
              "",
              "The formula for calculating the component of the base excess due to albumin is:",
              "",
            ],
            [
              "",
              {
                image: "equation3",
                width: 250,
                alignment: "center",
              },
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Bicarbonate",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Do not give intravenous sodium bicarbonate to children and young people with DKA. Only consider bicarbonate if there is life threatening hyperkalaemia or in severe acidosis with impaired myocardial contractility. It is anticipated that this would only ever be done following discussion with an intensivist.",
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Risk of venous thrombosis",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Be aware that there is a significant risk of femoral vein thrombosis in young and very sick children with DKA who have femoral lines inserted. Lines should be in situ as short a time as possible. Thromboembolic prophylaxis should be considered in young people >16 years (in line with NICE guidance), in young women taking the combined oral contraceptive pill and sick patients with femoral lines, following discussion with an intensivist.",
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Oral fluids",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Do not give oral fluids to a child or young person who is receiving intravenous fluids for DKA until ketosis is resolving and there is no nausea of vomiting.",
              "",
            ],
            [
              "",
              "A nasogastric tube may be necessary in the case of gastric paresis.",
              "",
            ],
            [
              "",
              "If oral fluids are given before the 48 hour rehydration period is completed, the IV infusion needs to be reduced to take account of the oral intake.",
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Fluid losses",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Do not give additional intravenous fluid to replace urinary losses. Urinary catheterisation should be avoided but may be useful in the child with impaired consciousness.",
              "",
            ],
            [
              "",
              "If a massive diuresis continues for several hours fluid input may need to be increased; this should be isotonic to the urine. If large volumes of gastric aspirate continue, these will need to be replaced with 0.45% saline with Potassium Chloride.",
              "",
            ],
            ["", " ", ""],
            [
              "",
              {
                text: "Other complications",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Other associations with DKA require specific management:",
              "",
            ],
            [
              "",
              "Continuing abdominal pain is common and may be due to liver swelling, gastritis, bladder retention, ileus. However, beware of appendicitis and ask for a surgical opinion once DKA is stable. A raised amylase is common in DKA.",
              "",
            ],
            [
              "",
              "Other problems are pneumothorax ± pneumo-mediastinum, interstitial pulmonary oedema, unusual infections (e.g. TB, fungal infections), hyperosmolar hyperglycaemic non–ketotic coma, ketosis in type 2 diabetes.",
              "",
            ],
            ["", "Discuss these with the consultant on-call. ", ""],
            ["", " ", ""],
            [
              "",
              {
                text: "Disclaimer",
                bold: true,
              },
              "",
            ],
            [
              "",
              "Important: Decisions about patient care remains the treating clinician's responsibility. By using this care pathway you confirm that you accept in full the terms of the disclaimer found at " +
                config.url.replace("https://", "") +
                ". If you do not agree to the terms, you must not use this care pathway.",
              "",
            ],
            ["", " ", ""],
            ["", " ", ""],
            [
              "",
              {
                text: "END OF INTEGRATED CARE PATHWAY",
                bold: true,
                alignment: "center",
              },
              "",
            ],
          ],
        },
      },
    ],
  };
  return docDef;
}

export { getDocDef };
