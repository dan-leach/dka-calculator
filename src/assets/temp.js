import { config } from "./config.js";
import { imageStore } from "./imageStore.js";

const indicatorCoordinates = {
  //functions that return the variable coordinates for indicator boxes on the protocol document
  xAxisShock: function (req) {
    //returns x-axis coordinate for the indicator box showing if patient is shocked or not
    if (req.shockPresent == "true")
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
    if (req.preExistingDiabetes == "true")
      return config.client.indicatorCoordinates.xAxisDiabetic.yes;
    return config.client.indicatorCoordinates.xAxisDiabetic.no;
  },
};

const capAlert = {
  //if a calculated variable is capped, returns asterisks and message to appear on protocol
  bolus: {
    asterisk: function (req) {
      //asterisk for capped bolus
      if (req.calculations.bolusVolume.isCapped) return "*";
      return "";
    },
    message: function (req) {
      //message for capped bolus
      if (req.calculations.bolusVolume.isCapped)
        return (
          "*Bolus capped to " +
          req.calculations.bolusVolume.mlsPerKg +
          "mL/kg for " +
          config.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  deficit: {
    asterisk: function (req) {
      //asterisk for capped deficit
      if (req.calculations.deficit.volume.isCapped) return "*";
    },
    message: function (req) {
      //message for capped deficit
      if (req.calculations.deficit.volume.isCapped)
        return (
          "*Deficit capped to volume for " +
          config.client.weightLimits.max +
          "kg with " +
          req.calculations.deficit.percentage.val +
          "% dehydration."
        );
      return "";
    },
  },
  maintenance: {
    asterisk: function (req) {
      //asterisk for capped maintenance
      if (req.calculations.maintenance.volume.isCapped) return "*";
    },
    message: function (req) {
      //message for capped maintenance
      if (req.calculations.maintenance.volume.isCapped)
        return (
          "*Maintenance capped to volume for " +
          config.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  insulin: {
    asterisk: function (req) {
      //asterisk for capped insulin
      if (req.calculations.insulinRate.isCapped) return "*";
    },
    message: function (req) {
      //message for capped insulin
      if (req.calculations.insulinRate.isCapped)
        return (
          "*Insulin rate capped to " +
          req.insulinRate +
          " Units/kg/hour for " +
          config.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  glucoseBolus: {
    asterisk: function (req) {
      //asterisk for capped glucose bolus
      if (req.calculations.glucoseBolusVolume.isCapped) return "*";
      return "";
    },
    message: function (req) {
      //message for capped glucose bolus
      if (req.calculations.glucoseBolusVolume.isCapped)
        return (
          "*Glucose bolus capped to " +
          req.calculations.glucoseBolusVolume.mlsPerKg +
          "mL/kg for " +
          config.client.weightLimits.max +
          "kg."
        );
      return "";
    },
  },
  hhsBolus: {
    asterisk: function (req) {
      //asterisk for capped hhs bolus
      if (req.calculations.hhsBolusVolume.isCapped) return "*";
      return "";
    },
    message: function (req) {
      //message for capped hhs bolus
      if (req.calculations.hhsBolusVolume.isCapped)
        return (
          "*HHS bolus capped to " +
          req.calculations.hhsBolusVolume.mlsPerKg +
          "mL/kg for " +
          config.client.weightLimits.max +
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

const tickCanvasArrays = {
  pumpStoppedNA: function (req) {
    if (req.preExistingDiabetes == "false") return [];
    if (req.insulinDeliveryMethod == "pump") return [];
    return [
      {
        type: "polyline",
        lineWidth: 2,
        closePath: false,
        points: [
          { x: 240, y: 44 },
          { x: 245, y: 49 },
          { x: 249, y: 40 },
        ],
      },
    ];
  },
};

const preventableFactors = {
  main: function (req) {
    let msg = "";
    if (req.preventableFactors[0] == "No") {
      msg =
        "When this protocol was generated the user indicated that there were no preventable/modifiable factors which may have led to this episode of DKA. If you now have information to suggest there were preventable/modifiable factors please update the audit data using the instructions below.";
    } else if (req.preventableFactors[0] == "Not yet known") {
      msg =
        "When this protocol was generated the user indicated that it was not yet known if there were preventable/modifiable factors which may have led to this episode of DKA. Please update the audit data using the instructions below.";
    } else {
      msg =
        "When this protocol was generated the user indicated the following preventable/modifiable factors may have led to this episode of DKA: ";
      let factorsString = "";
      for (let factor of req.preventableFactors)
        factorsString += factor.toLowerCase() + ", ";
      factorsString = factorsString.slice(0, -2); //remove trailing comma and space
      msg +=
        factorsString +
        ". If you now know that other preventable/modifiable factors apply, or no longer feel the selected factors are representative, please update the audit data using the instructions below.";
    }
    return msg;
  },
  instructions: function (req) {
    return (
      "To update the preventable/modifiable factors data for this episode go to dka-calculator.co.uk/update and enter the audit ID: " +
      req.auditID
    );
  },
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
      page10: imageStore.flowChart8,
      page11: imageStore.table1,
      page12: imageStore.flowChart910,
      page13: imageStore.flowChart1112,
      page14: imageStore.flowChart13,
      page15: imageStore.appendixBG,
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
        return [{ image: "page15", width: pageSize.width }];
      }
      if (currentPage == 16) {
        return [{ image: "page15", width: pageSize.width }];
      }
      if (currentPage == 17) {
        return [{ image: "page15", width: pageSize.width }];
      }
    },
  };
  return docDef;
}

export { getDocDef };
