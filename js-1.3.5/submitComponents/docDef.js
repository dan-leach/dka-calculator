function getDocDef(inputs, calcVars){ //returns the object describing the protocol document
    
    const docDef = {
        
        pageSize: 'A4',
        pageOrientation: 'portrait',
        pageMargins: [ 0, 50, 0, 40],// [left, top, right, bottom]
        
        styles: {
            header: { //for the patient demographics etc at the top of each page
                fontSize: 10,
            },
            timing: { //for the datetime stamps on the serial data table
                fontSize: 8,
                color: 'grey'
            },
            table: { //for the GCS and estimated weight tables
                fontSize: 10,
                alignment: 'center'
            },
            heading: { //for the section headings in the appedncies
                fontSize: 12,
                bold: true
            },
            appendix: { //for the appendicies body text
                fontSize: 10
            }
        },

        /*watermark: {
            text: 'DKA Calculator Development Version - Not for clinical use', color: 'red', opacity: 0.3, bold: true, italics: false
        },*/
        
        header: function(currentPage, pageCount) { // adds demographic, page number, generation datetime stamp and calculator URL to all headers except title page
            if(currentPage==1){
                return "";
            } else {
                return {
                    table: {
                        widths: ['2%', '33%', '30%', '33%', '2%'],
                        body: [
                            [
                                {text: ""},
                                {text: "Name: "+inputs.name, alignment: 'left', style: 'header'},
                                {text: "www.dka-calculator.co.uk (v1.3.5)", alignment: 'center', style: 'header'},
                                {text: "Protocol Page "+currentPage+" of "+pageCount, alignment: 'right', style: 'header'},
                                {text: ""}
                            ],
                            [
                                {text: ""},
                                {text: "Date of Birth: "+inputs.dob, alignment: 'left', style: 'header'},
                                {text: ""},
                                {text: "Audit ID: "+inputs.auditID, alignment: 'right', style: 'header'},
                                {text: ""}
                            ],
                            [
                                {text: ""},
                                {text: "Number: "+inputs.num, alignment: 'left', style: 'header'},
                                {text: ""},
                                {text: "Protocol start: "+inputs.protocolStart, alignment: 'right', style: 'header'},
                                {text: ""}
                            ]
                        ]
                    },
                    layout: 'noBorders'
                };
            }
        },
        
        images:{ //retrieves images from imageStore.js
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
            equation4: imageStore.equation4
        },

        background: function(currentPage, pageSize) { //places protocol images onto each page, fitted to size
            if(currentPage==1){
                return [
                    {image: 'page1',
                    width: pageSize.width}
                ];
            }
            if(currentPage==2){
                return [
                    {image: 'page2',
                    width: pageSize.width}
                ];
            }
            if(currentPage==3){
                return [
                    {image: 'page3',
                    width: pageSize.width}
                ];
            }
            if(currentPage==4){
                return [
                    {image: 'page4',
                    width: pageSize.width}
                ];
            }
            if(currentPage==5){
                return [
                    {image: 'page5',
                    width: pageSize.width}
                ];
            }
            if(currentPage==6){
                return [
                    {image: 'page6',
                    width: pageSize.width}
                ];
            }
            if(currentPage==7){
                return [
                    {image: 'page7',
                    width: pageSize.width}
                ];
            }
            if(currentPage==8){
                return [
                    {image: 'page8',
                    width: pageSize.width}
                ];
            }
            if(currentPage==9){
                return [
                    {image: 'page9',
                    width: pageSize.width}
                ];
            }
            if(currentPage==10){
                return [
                    {image: 'page10',
                    width: pageSize.width}
                ];
            }
            if(currentPage==11){
                return [
                    {image: 'page11',
                    width: pageSize.width}
                ];
            }
            if(currentPage==12){
                return [
                    {image: 'page12',
                    width: pageSize.width}
                ];
            }
            if(currentPage==13){
                return [
                    {image: 'page13',
                    width: pageSize.width}
                ];
            }
            if(currentPage==14){
                return [
                    {image: 'page14',
                    width: pageSize.width}
                ];
            }
            if(currentPage==15){
                return [
                    {image: 'page14',
                    width: pageSize.width}
                ];
            }
            if(currentPage==16){
                return [
                    {image: 'page14',
                    width: pageSize.width}
                ];
            }
        },

        content: [ // variables added over top of protocol images, and text for appendicies
            //page 1
            //patient demographics box
            {
                text: "Name: "+inputs.name,
                fontSize: 12,
                absolutePosition: {x: 60, y: 306},
            },
            {
                text: "Date of Birth: "+inputs.dob,
                fontSize: 12,
                absolutePosition: {x: 60, y: 324},
            },
            {
                text: "Hospital/NHS Number: "+inputs.num,
                fontSize: 12,
                absolutePosition: {x: 60, y: 342},
            },
            {
                text: "Audit linkage ID: " +inputs.auditID,
                fontSize: 12,
                absolutePosition: {x: 60, y: 360},
            },
            {
                text: "Generated: "+inputs.client_DT,
                fontSize: 12,
                absolutePosition: {x: 60, y: 378},
            },
            //Protocol start datetime box
            {
                text: moment(inputs.protocolStart, "DD/MM/YYYY HH:mm").format("HH:mm"),
                fontSize: 12,
                absolutePosition: {x: 410, y: 328},
            },
            {
                text: moment(inputs.protocolStart, "DD/MM/YYYY HH:mm").format("DD/MM/YYYY"),
                fontSize: 12,
                absolutePosition: {x: 400, y: 372},
            },
            //calculator input check box
            {
                text: "This protocol was generated at www.dka-calculator.co.uk and certain elements of the document, such as fluid",
                link: "https://www.dka-calculator.co.uk",
                fontSize: 10,
                absolutePosition: {x: 65, y: 645},
            },
            {
                text: "calculations have been pre-filled. The following values were used and should be checked for accuracy before",
                link: "https://www.dka-calculator.co.uk",
                fontSize: 10,
                absolutePosition: {x: 65, y: 661},
            },
            {
                text: "using this protocol. Please read the disclaimer at the end of this document before use.",
                fontSize: 10,
                absolutePosition: {x: 65, y: 677},
            },
            {
                text: "Weight: "+inputs.weight+"kg (Weight safety limit override? "+inputs.override+")",
                fontSize: 10,
                absolutePosition: {x: 65, y: 709},
            },
            {
                text: "pH: "+inputs.pH,
                fontSize: 10,
                absolutePosition: {x: 325, y: 709},
            },
            {
                text: "Patient clinically shocked? "+inputs.shock,
                fontSize: 10,
                absolutePosition: {x: 65, y: 725},
            },
            {
                text: "Starting insulin infusion rate: "+inputs.insulin+" Units/kg/hour",
                fontSize: 10,
                absolutePosition: {x: 325	, y: 725},
            },
            {
                text: "Pre-existing diabetes? "+inputs.preDM,
                fontSize: 10,
                absolutePosition: {x: 65, y: 741},
            },
            {
                text: "Sex: "+inputs.sex,
                fontSize: 10,
                absolutePosition: {x: 325, y: 741}
            },
            {
                text: "https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/",
                link: "https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/",
                fontSize: 10,
                absolutePosition: {x: 250, y: 540},
                pageBreak: 'after'
            },
            //page 2
            {
                text: '',
                pageBreak: 'after'
            },
            //page 3
            { //record initial values box
                text: inputs.pH,
                fontSize: 12,
                absolutePosition: {x: 222, y: 247},
                pageBreak: 'after'
            },
            //page 4
            { //Is patient shocked yes/no indicator box
                canvas: [
                    {
                        type: 'rect',
                        x: calcVars.utilities.indicatorCoordinates.xAxisShock(),
                        y: 332,
                        w: 40,
                        h: 40,
                        lineColor: '#00ff2e',
                        lineWidth: 10
                    }
                ]
            },
            { //patient weight box
                text: inputs.weight,
                fontSize: 18,
                absolutePosition: {x: 287, y: 240},
            },
            // bolus volumes
            //1st 10ml/kg resus bolus
            {
                text: calcVars.bolus.volume(10).toFixed(),
                fontSize: 18,
                absolutePosition: {x: 95, y: 453},
            },
            //* if bolus capped
            {
                text: calcVars.utilities.capAlert.bolus.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 128, y: 453},
                color: "red",
            },
            //2nd 10ml/kg resus bolus
            {
                text: calcVars.bolus.volume(10).toFixed(),
                fontSize: 18,
                absolutePosition: {x: 95, y: 538},
            },
            {
                text: calcVars.utilities.capAlert.bolus.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 128, y: 538},
                color: "red",
            },
            //3rd 10ml/kg resus bolus
            {
                text: calcVars.bolus.volume(10).toFixed(),
                fontSize: 18,
                absolutePosition: {x: 95, y: 568},
            },
            {
                text: calcVars.utilities.capAlert.bolus.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 128, y: 568},
                color: "red",
            },
            //4th 10ml/kg resus bolus
            {
                text: calcVars.bolus.volume(10).toFixed(),
                fontSize: 18,
                absolutePosition: {x: 95, y: 598},
            },
            {
                text: calcVars.utilities.capAlert.bolus.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 128, y: 598},
                color: "red",
            },
            //10ml/kg slow bolus - non-shocked arm
            {
                text: calcVars.bolus.volume(10).toFixed(),
                fontSize: 18,
                absolutePosition: {x: 375, y: 462},
            },
            {
                text: calcVars.utilities.capAlert.bolus.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 408, y: 462},
                color: "red",
            },
            {
                text: calcVars.utilities.capAlert.bolus.message(),
                fontSize: 14,
                absolutePosition: {x: 40, y: 640},
                color: "red",
                pageBreak: 'after'
            },
            //page 5
            {
                text: '',
                pageBreak: 'after'
            },
            //page 6
            { //DKA severity indicator box
                canvas: [
                    {
                        type: 'rect',
                        x: 190,
                        y: calcVars.utilities.indicatorCoordinates.yAxisSeverity(),
                        w: 170,
                        h: 40,
                        lineColor: '#00ff2e',
                        lineWidth: 10
                    }
                ]
            },
            //fluid deficit
            {
                text: inputs.weight,
                fontSize: 18,
                absolutePosition: {x: 170, y: 280},
            },
            {       
                text: calcVars.deficit.percentage(),
                fontSize: 18,
                absolutePosition: {x: 310, y: 280},
            },
            {
                text: calcVars.deficit.volume().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 430, y: 280},
            },
            {
                text: calcVars.utilities.capAlert.deficit.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 470, y: 280},
                color: "red",
            },
            {
                text: calcVars.utilities.capAlert.deficit.message(),
                fontSize: 14,
                absolutePosition: {x: 200, y: 322},
                color: "red",
            },
            //fluid deficit (less bolus volume)
            {
                text: calcVars.deficit.volume().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 170, y: 390},
            },
            {
                text: calcVars.deficit.bolusToSubtract().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 300, y: 390},
            },
            {
                text: calcVars.deficit.volumeLessBolus().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 430, y: 390},
            },
            //deficit replacement rate
            {
                text: calcVars.deficit.volumeLessBolus().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 225, y: 470},
            },
            {
                text: calcVars.deficit.rate().toFixed(1),
                fontSize: 18,
                absolutePosition: {x: 430, y: 470},
            },
            //maintenance rate
            {
                text: calcVars.maintenance.volume().toFixed(),
                fontSize: 18,
                absolutePosition: {x: 185, y: 565},
            },
            {
                text: calcVars.utilities.capAlert.maintenance.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 225, y: 565},
                color: "red",
            },
            {
                text: calcVars.utilities.capAlert.maintenance.message(),
                fontSize: 14,
                absolutePosition: {x: 225, y: 604},
                color: "red",
            },
            {
                text: calcVars.maintenance.rate().toFixed(1),
                fontSize: 18,
                absolutePosition: {x: 395, y: 565},
            },
            //starting fluid rate
            {
                text: calcVars.maintenance.rate().toFixed(1),
                fontSize: 18,
                absolutePosition: {x: 205, y: 650},
            },
            {
                text: calcVars.deficit.rate().toFixed(1),
                fontSize: 18,
                absolutePosition: {x: 330, y: 650},
            },
            {
                text: calcVars.startingFluidRate().toFixed(1),
                fontSize: 18,
                absolutePosition: {x: 455, y: 650},
                pageBreak: 'after'
            },
            //page 7
            { //Patient has pre-existing diabetes yes/no indicator box
                canvas: [
                    {
                        type: 'rect',
                        x: calcVars.utilities.indicatorCoordinates.xAxisDiabetic(),
                        y: 400,
                        w: 40,
                        h: 40,
                        lineColor: '#00ff2e',
                        lineWidth: 10
                    }
                ]
            },
            //insulin hourly rate
            {
                text: parseFloat(inputs.insulin),
                fontSize: 18,
                absolutePosition: {x: 170, y: 205},
            },
            {
                text: inputs.weight,
                fontSize: 18,
                absolutePosition: {x: 315, y: 205},
            },
            {
                text: calcVars.insulin.rate().toFixed(2),
                fontSize: 18,
                absolutePosition: {x: 440, y: 205},
            },
            {
                text: calcVars.utilities.capAlert.insulin.asterisk(),
                fontSize: 18,
                absolutePosition: {x: 475, y: 205},
                color: "red",
            },
            {
                text: calcVars.utilities.capAlert.insulin.message(),
                fontSize: 14,
                absolutePosition: {x: 230, y: 235},
                color: "red",
                pageBreak: 'after'
            },
            //page 8
            {
                text: '',
                pageBreak: 'after'
            },
            //page 9
            {
                text: '',
                pageOrientation: 'landscape', //changes orientation for following page
                pageBreak: 'after'
            },
            //page 10 - adds time and date for each box on serial data sheet
            {
                text: calcVars.utilities.timing.time(0),
                style: 'timing',
                absolutePosition: {x: 107, y: 86},
            },
            {
                text: calcVars.utilities.timing.date(0),
                style: 'timing',
                absolutePosition: {x: 97, y: 93},
            },
            {
                text: calcVars.utilities.timing.time(2),
                style: 'timing',
                absolutePosition: {x: 107, y: 105},
            },
            {
                text: calcVars.utilities.timing.date(2),
                style: 'timing',
                absolutePosition: {x: 97, y: 112},
            },
            {
                text: calcVars.utilities.timing.time(6),
                style: 'timing',
                absolutePosition: {x: 107, y: 143},
            },
            {
                text: calcVars.utilities.timing.date(6),
                style: 'timing',
                absolutePosition: {x: 97, y: 150},
            },
            {
                text: calcVars.utilities.timing.time(10),
                style: 'timing',
                absolutePosition: {x: 107, y: 181},
            },
            {
                text: calcVars.utilities.timing.date(10),
                style: 'timing',
                absolutePosition: {x: 97, y: 188},
            },
            {
                text: calcVars.utilities.timing.time(14),
                style: 'timing',
                absolutePosition: {x: 107, y: 219},
            },
            {
                text: calcVars.utilities.timing.date(14),
                style: 'timing',
                absolutePosition: {x: 97, y: 226},
            },
            {
                text: calcVars.utilities.timing.time(18),
                style: 'timing',
                absolutePosition: {x: 107, y: 256},
            },
            {
                text: calcVars.utilities.timing.date(18),
                style: 'timing',
                absolutePosition: {x: 97, y: 263},
            },
            {
                text: calcVars.utilities.timing.time(22),
                style: 'timing',
                absolutePosition: {x: 107, y: 294},
            },
            {
                text: calcVars.utilities.timing.date(22),
                style: 'timing',
                absolutePosition: {x: 97, y: 301},
            },
            {
                text: calcVars.utilities.timing.time(26),
                style: 'timing',
                absolutePosition: {x: 107, y: 332},
            },
            {
                text: calcVars.utilities.timing.date(26),
                style: 'timing',
                absolutePosition: {x: 97, y: 339},
            },
            {
                text: calcVars.utilities.timing.time(30),
                style: 'timing',
                absolutePosition: {x: 107, y: 370},
            },
            {
                text: calcVars.utilities.timing.date(30),
                style: 'timing',
                absolutePosition: {x: 97, y: 377},
            },
            {
                text: calcVars.utilities.timing.time(34),
                style: 'timing',
                absolutePosition: {x: 107, y: 407},
            },
            {
                text: calcVars.utilities.timing.date(34),
                style: 'timing',
                absolutePosition: {x: 97, y: 414},
            },
            {
                text: calcVars.utilities.timing.time(38),
                style: 'timing',
                absolutePosition: {x: 107, y: 445},
            },
            {
                text: calcVars.utilities.timing.date(38),
                style: 'timing',
                absolutePosition: {x: 97, y: 452},
            },
            {
                text: calcVars.utilities.timing.time(42),
                style: 'timing',
                absolutePosition: {x: 107, y: 482},
            },
            {
                text: calcVars.utilities.timing.date(42),
                style: 'timing',
                absolutePosition: {x: 97, y: 489},
            },
            {
                text: '',
                pageOrientation: 'portrait', //changes orientation for following page
                pageBreak: 'after'
            },
            //page 11
            {
                text: '',
                pageBreak: 'after'
            },
            //page 12
            {
                text: '',
                pageBreak: 'after'
            },
            //page 13
            {
                text: "https://www.ispad.org/resource/resmgr/consensus_guidelines_2018_/11.diabetic_ketoacidosis_and.pdf",
                link: "https://www.ispad.org/resource/resmgr/consensus_guidelines_2018_/11.diabetic_ketoacidosis_and.pdf",
                fontSize: 7,
                absolutePosition: {x: 220, y: 675},
                pageBreak: 'after'
            },
            //page 14
            { //outer table adds 20px border for whole page
                layout: 'noBorders',
                style: 'table',
                table: {
                headerRows: 0,
                widths: [ 20, '*', 20 ],
                body: [
                    [ '', {
                        text: 'APPENDIX 1 - GLASGOW COMA SCORE',
                        style: 'heading',
                        alignment: 'center'
                    }, '' ],
                    [ '', {
                        layout: 'noBorders',
                        style: 'table',
                        table: {
                        headerRows: 1,
                        widths: [ '*', 'auto', 'auto', '*' ],
                        body: [
                            [ '', 'Best Motor Response', 'Eye Opening', '' ],
                            [ '', '1 = none', '1 = none', '' ],
                            [ '', '2 = extensor response to pain', '2 = to pain', ''],
                            [ '', '3 = abnormal flexion to pain', '3 = to speech', ''],
                            [ '', '4 = withdraws from pain', '4 = spontaneous', ''],
                            [ '', '5 = localises pain', '', '' ],
                            [ '', '6 = responds to commands', '', '' ]
                        ]
                        }
                    }, '' ],
                    ['', ' ', ''], //adds a line break
                    [ '', {
                        layout: 'noBorders',
                        style: 'table',
                        table: {
                        headerRows: 1,
                        widths: [ '*', 'auto', '*' ],
                        body: [
                            [ '', 'Best Verbal Response (with modification for younger patients)', '' ]
                        ]
                        }
                    }, '' ],
                    [ '', {
                        layout: 'noBorders',
                        style: 'table',
                        table: {
                        headerRows: 1,
                        widths: [ 'auto', 'auto', 'auto' ],
                        body: [
                            [ '>5 years', '2-5 years', '<2 years' ],
                            [ '1 = none', '1 = none', '1 = none' ],
                            [ '2 = incomprehensible sounds', '2 = grunts', 'grunts' ],
                            [ '3 = inappropriate words', '3 = cries or screams', '3 = inappropriate crying or unstimulated screaming' ],
                            [ '4 = appropriate words but confused', '4 = monosyllables', '4 = cries only'],
                            [ '5 = fully orientated', '5 = words of any sort', '5 = appropriate non-verbal responses (coos, smiles, cries)' ]
                        ]
                        }
                    }, ''],
                    [ '', ' ', ''],
                    [ '', ' ', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'APPENDIX 2 - ESTIMATED WEIGHT TABLE',
                        style: 'heading',
                        alignment: 'center'
                    }, '' ],
                    [ '', {
                        layout: 'noBorders',
                        style: 'table',
                        table: {
                        headerRows: 1,
                        widths: [ '*', 'auto', 'auto', 'auto', '*' ],
                        body: [
                            [ {text:''}, {text:''}, {text:'Guide weight (kg)', colSpan:2}, {text:''}, {text:''} ],
                            [ '', 'Age', 'Male', 'Female','' ],
                            [ '', '6 months', '8', '7', '' ],
                            [ '', '12 months', '9.5', '9', '' ],
                            [ '', '18 months', '11', '10', '' ],
                            [ '', '2 years', '12', '12', '' ],
                            [ '', '3 years', '14', '14', '' ],
                            [ '', '4 years', '16', '16', '' ],
                            [ '', '5 years', '18', '18', '' ],
                            [ '', '6 years', '21', '20', '' ],
                            [ '', '7 years', '23', '22', '' ],
                            [ '', '8 years', '25', '25', '' ],
                            [ '', '9 years', '28', '28', '' ],
                            [ '', '10 years', '31', '32', '' ],
                            [ '', '11 years', '35', '35', '' ],
                            [ '', '12 years', '43', '43', '' ],
                            [ '', '14 years', '50', '50', '' ],
                            [ '', 'Adult', '70', '70', '' ],
                        ]
                        }
                    }, '' ],
                    [ '', {
                        layout: 'noBorders',
                        style: 'table',
                        table: {
                        headerRows: 1,
                        widths: [ '*', 'auto', '*' ],
                        body: [
                            [ '', {text:'Adapted from Advanced Paediatric Life Support, version 6, 2016', italics: true, bold: true}, '' ]
                        ]
                        }
                    }, '']
                ]
            }
            },
            {
                text: '',
                pageBreak: 'after'
            },
            //page 15
            { //outer table adds 20px border for whole page
                layout: 'noBorders',
                style: 'appendix',
                table: {
                headerRows: 0,
                widths: [ 20, '*', 20 ],
                body: [
                    [ '', {
                        text: 'APPENDIX 3 - MAKING UP IV FLUIDS',
                        style: 'heading',
                        alignment: 'center'
                    }, '' ],
                    [ '', 'The following fluids are generally available from Pharmacy. They may not be available on every ward. If you need to make it up, please do so as below, rather than waiting for pharmacy.', ''],
                    [ '', ' ', '' ],
                    [ '', {
                        text: '0.9% Sodium Chloride with 5% Glucose and 20 mmol Potassium Chloride in 500mL',
                        bold: true,
                        alignment: 'center'
                    }, '' ],
                    [ '', '      1. Remove 50mL from a bag of Sodium Chloride 0.9% with 20mmol Potassium Chloride in 500mL', '' ],
                    [ '', '      2. Draw up 50mL of Glucose 50% using a syringe and add to the above bag to make the glucose concentration 5%', '' ],
                    [ '', '      3. Mix well before administration', '' ],
                    [ '', ' ', '' ],
                    [ '', {
                        text: '0.9% Sodium Chloride with 10% Glucose and 20 mmol Potassium Chloride in 500mL',
                        bold: true,
                        alignment: 'center'
                    }, '' ],
                    [ '', '      1. Remove 50mL from a bag of Sodium Chloride 0.9% with 5% Glucose and 20mmol Potassium Chloride in 500mL', '' ],
                    [ '', '      2. Draw up 50mL of Glucose 50% using a syringe and add to the above bag to make the glucose concentration 10% ', '' ],
                    [ '', '      3. Mix well before administration', '' ],
                    [ '', ' ', '' ],
                    [ '', 'Plasmalyte does not contain enough potassium to be used on its own; discuss with pharmacy/PICU before using as maintenance fluid to ensure adequate potassium replacement is provided.', '' ],
                    [ '', ' ', '' ],
                    [ '', ' ', '' ],			        
                    [ '', {
                        text: 'APPENDIX 4 - EXPLANATORY NOTES',
                        style: 'heading',
                        alignment: 'center'
                    }, '' ],
                    [ '', ' ', '' ],        			
                    [ '', 
                        {//this table arrangement required to subscript corr of Nacorr
                            layout: {
                                paddingLeft: function(i, node) { return 0; },
                                paddingRight: function(i, node) { return 0; },
                                paddingTop: function(i, node) { return 0; },
                                paddingBottom: function(i, node) { return 0; }
                            },
                            margin: [ 0, 0, 0, 0 ],
                            style: 'appendix',
                            table: {
                                headerRows: 0,
                                widths: [ 'auto', 'auto', '*' ],
                                body: [
                                    [ {
                                        text: 'Sodium and Corrected Sodium (Na',
                                        border: [false, false, false, false],
                                        bold: true
                                    },
                                    {
                                        layout: {
                                            paddingLeft: function(i, node) { return 0; },
                                            paddingRight: function(i, node) { return 0; },
                                            paddingTop: function(i, node) { return 0; },
                                            paddingBottom: function(i, node) { return 0; }
                                        },
                                        margin: [ 0, 0, 0, 0 ],
                                        style: 'appendix',
                                        border: [false, false, false, false],
                                        table: {
                                            headerRows: 0,
                                            widths: [ 'auto' ],
                                            body: [
                                                [ {
                                                    text: ' ',
                                                    fontSize: 3,
                                                    border: [false, false, false, false],
                                                    bold: true
                                                } ],
                                                [ {
                                                    text: 'corr',
                                                    fontSize: 8,
                                                    border: [false, false, false, false],
                                                    bold: true
                                                } ]
                                            ]
                                        }
                                    },
                                    {
                                        text: ')',
                                        border: [false, false, false, false],
                                        bold: true
                                    } ]
                                ]
                            }
                        },
                    '',],
                    [ '', 'Hyponatraemia occurs in DKA as with hyperglycaemia the extracellular osmolality rises resulting in water movement from the intracellular space into extracellular space causing dilution of extracellular sodium and a low serum sodium. However, when glucose begins to fall through hydration and insulin, and the plasma glucose concentration is reduced, water leaves the extracellular space entering intracellular space raising the extracellular sodium concentration again and the serum sodium typically rises. Corrected sodium levels give an indication of the amount of free water in the circulation.', ''],
                    [ '', 'Corrected sodium levels should typically rise as blood glucose levels fall during treatment. It has been suggested that corrected sodium levels give an indication of the risk of cerebral oedema with a falling corrected sodium indicating an excess of free water and an increased risk of cerebral oedema.', ''],
                    [ '', 'If corrected sodium levels fall during treatment, discuss with the consultant on call.', ''],
                    [ '', 'The formula for corrected sodium is:', ''],
                    [ '', {
                        image: 'equation1',
                        width: 250,
                        alignment: 'center'
                    }, ''],
                    [ '', { text: 'For worked examples, refer to the full guideline (https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/).', link: 'https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/' }, ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Hyperchloraemic metabolic acidosis',
                        bold: true
                    }, ''],
                    [ '', 'Hyperchloraemic metabolic acidosis may occur following the administration of large amounts of chloride containing fluids given during the management of DKA. The preferential renal excretion of ketones instead of chloride can result in hyperchloraemia.  The acidifying effect of chloride can mask the resolution of ketoacidosis if base deficit alone is used to monitor progress as there may appear to be a continuing base deficit with a continued low bicarbonate due to the chloride component rather than due to ketosis. Direct monitoring of ketones and calculation of the component of the base deficit due to chloride will help differentiate whether persisting acidosis is due to ongoing ketosis that may need additional treatment (adjustment to insulin infusion or fluids) or due to hyperchloraemia. Acidosis due to hyperchloraemia will correct spontaneously and doesn’t need specific treatment. Acidosis due to hyperchloraemia need not delay the transition to oral fluids and subcutaneous insulin. It needs differentiating from ongoing ketosis.', ''],
                    [ '', ' ', '']
                ]
                }
            },
            {
                text: '',
                pageBreak: 'after'
            },
            //page 16
            { //outer table adds 20px border for whole page
                layout: 'noBorders',
                style: 'appendix',
                table: {
                headerRows: 0,
                widths: [ 20, '*', 20 ],
                body: [
                    [ '', 'The formula for calculating the component of the base excess due to chloride is:', ''],
                    [ '', {
                        image: 'equation2',
                        width: 250,
                        alignment: 'center'
                    }, ''],
                    [ '', { text: 'For worked examples, refer to the full guideline (https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/).', link: 'https://www.bsped.org.uk/clinical-resources/bsped-dka-guidelines/' }, ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Albumin',
                        bold: true
                    }, ''],
                    [ '', 'A low serum albumin can also contribute to a persisting acidosis which may be erroneously attributed to persisting ketosis. Some intensivists also recommend partitioning the component of apparent acidosis due to the reduced albumin to avoid it being inappropriately attributed to persisting ketosis.', ''],
                    [ '', 'The formula for calculating the component of the base excess due to albumin is:', ''],
                    [ '', {
                        image: 'equation3',
                        width: 250,
                        alignment: 'center'
                    }, ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Bicarbonate',
                        bold: true
                    }, ''],
                    [ '', 'Do not give intravenous sodium bicarbonate to children and young people with DKA. Only consider bicarbonate if there is life threatening hyperkalaemia or in severe acidosis with impaired myocardial contractility. It is anticipated that this would only ever be done following discussion with an intensivist.', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Risk of venous thrombosis',
                        bold: true
                    }, ''],
                    [ '', 'Be aware that there is a significant risk of femoral vein thrombosis in young and very sick children with DKA who have femoral lines inserted. Lines should be in situ as short a time as possible. Thromboembolic prophylaxis should be considered in young people >16 years (in line with NICE guidance), in young women taking the combined oral contraceptive pill and sick patients with femoral lines, following discussion with an intensivist.', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Oral fluids',
                        bold: true
                    }, ''],
                    [ '', 'Do not give oral fluids to a child or young person who is receiving intravenous fluids for DKA until ketosis is resolving and there is no nausea of vomiting.', ''],
                    [ '', 'A nasogastric tube may be necessary in the case of gastric paresis.', ''],
                    [ '', 'If oral fluids are given before the 48 hour rehydration period is completed, the IV infusion needs to be reduced to take account of the oral intake.', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Fluid losses',
                        bold: true
                    }, ''],
                    [ '', 'Do not give additional intravenous fluid to replace urinary losses. Urinary catheterisation should be avoided but may be useful in the child with impaired consciousness.', ''],
                    [ '', 'If a massive diuresis continues for several hours fluid input may need to be increased; this should be isotonic to the urine. If large volumes of gastric aspirate continue, these will need to be replaced with 0.45% saline with Potassium Chloride.', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Other complications',
                        bold: true
                    }, ''],
                    [ '', 'Other associations with DKA require specific management:', ''],
                    [ '', 'Continuing abdominal pain is common and may be due to liver swelling, gastritis, bladder retention, ileus. However, beware of appendicitis and ask for a surgical opinion once DKA is stable. A raised amylase is common in DKA.', ''],
                    [ '', 'Other problems are pneumothorax ± pneumo-mediastinum, interstitial pulmonary oedema, unusual infections (e.g. TB, fungal infections), hyperosmolar hyperglycaemic non–ketotic coma, ketosis in type 2 diabetes.', ''],
                    [ '', 'Discuss these with the consultant on-call. ', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'Disclaimer',
                        bold: true
                    }, ''],
                    [ '', "Important: Decisions about patient care remains the treating clinician's responsibility. By using this care pathway you confirm that you accept in full the terms of the disclaimer found at www.dka-calculator.co.uk. If you do not agree to the terms, you must not use this care pathway.", ''],
                    [ '', ' ', ''],
                    [ '', ' ', ''],
                    [ '', {
                        text: 'END OF INTEGRATED CARE PATHWAY',
                        bold: true,
                        alignment: 'center'
                    }, '']
                ]
                }
            }
        ]
    };

    return docDef;
};