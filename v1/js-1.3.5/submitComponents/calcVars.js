function getCalcVars(inputs){ //recieves inputs and returns object with required variables as below for building the documentDefinition
    const calcVars = {
        patient: { //functions relating to the patient state
            isDiabetic: function(){ //if patient is had pre-existing diabetes returns true
                if(inputs.preDM==="Yes") return true;
                if(inputs.preDM==="No") return false;
                throw new Error("Unable to select isDiabetic");
            },
            isShocked: function(){ //if patient is being managed on shocked arm of resusitation flow chart returns true
                if(inputs.shock==="Yes") return true;
                if(inputs.shock==="No") return false;
                throw new Error("Unable to select isShocked");
            },
            severity: { //functions for each severity range that return true if patient is in that range
                isSevere: function(){ //if patient's pH meets criteria for severe DKA returns true
                    if((inputs.pH < settings.severity.severe.range.upper) && (inputs.pH >= settings.severity.severe.range.lower)) return true;
                    return false;
                },
                isModerate: function(){ //if patient's pH meets criteria for moderate DKA returns true
                    if((inputs.pH < settings.severity.moderate.range.upper) && (inputs.pH >= settings.severity.moderate.range.lower)) return true;
                    return false;
                },
                isMild: function(){ //if patient's pH meets criteria for mild DKA returns true
                    if((inputs.pH <= settings.severity.mild.range.upper) && (inputs.pH >= settings.severity.mild.range.lower)) return true;
                    return false;
                },
            },
        },
        utilities: {
            volumeToRate: function(volume, unitTime){ //takes a volume and divides by number of unitTime over which it should run to give a rate in volumeUnit/unitTime
                return volume/unitTime;
            },
            timing: { //functions that return the date or time of a moment a given number of hours since the start of the protocol
                time: function(addHours){ //returns time component of datetime; addHours after protocolStart
                    return moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('HH:mm');
                },
                date: function(addHours){ //returns date component of datetime; addHours after protocolStart
                    return moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('DD/MM/YYYY');
                },
            },
            indicatorCoordinates: { //functions that return the variable coordinates for indicator boxes on the protocol document
                xAxisShock: function(){ //returns x-axis coordinate for the indicator box showing if patient is shocked or not
                    if(calcVars.patient.isShocked()) return settings.indicatorCoordinates.xAxisShock.yes;
                    return settings.indicatorCoordinates.xAxisShock.no;
                },
                yAxisSeverity: function(){ //returns y-axis coordinate for the indicator box showing severity of DKA
                    if(calcVars.patient.severity.isSevere()) return settings.indicatorCoordinates.yAxisSeverity.severe;
                    if(calcVars.patient.severity.isModerate()) return settings.indicatorCoordinates.yAxisSeverity.moderate;
                    if(calcVars.patient.severity.isMild()) return settings.indicatorCoordinates.yAxisSeverity.mild;
                    throw new Error("Unable to select yAxisSeverity");
                },
                xAxisDiabetic: function(){ //returns x-axis coordinate for the indicator box showing if patient had pre-existing diabetes
                    if(calcVars.patient.isDiabetic()) return settings.indicatorCoordinates.xAxisDiabetic.yes;
                    return settings.indicatorCoordinates.xAxisDiabetic.no;
                },
            },
            capAlert: { //if a calculated variable is capped, returns asterisks and message to appear on protocol
                bolus: {
                    asterisk: function(){ //asterisk for capped bolus
                        if (calcVars.bolus.isCapped(10)) return "*";
                        return "";
                    },
                    message: function(){ //message for capped bolus
                        if (calcVars.bolus.isCapped(10)) return "*Bolus capped to 10mL/kg for " + settings.caps.weight + "kg.";
                        return "";
                    },
                },
                deficit: {
                    asterisk: function(){ //asterisk for capped deficit
                        if (calcVars.deficit.isCapped()) return "*";
                    },
                    message: function(){ //message for capped deficit
                        if (calcVars.deficit.isCapped()) return "*Deficit capped to volume for " + settings.caps.weight + "kg with " + calcVars.deficit.percentage() + "% dehydration.";
                        return "";
                    },
                },
                maintenance: {
                    asterisk: function(){ //asterisk for capped maintenance
                        if (calcVars.maintenance.isCapped()) return "*";
                    },
                    message: function(){ //message for capped maintenance
                        if (calcVars.maintenance.isCapped()) return "*Maintenance capped to volume for " + settings.caps.weight + "kg.";
                        return "";
                    },
                },
                insulin: {
                    asterisk: function(){ //asterisk for capped insulin
                        if (calcVars.insulin.isCapped()) return "*";
                    },
                    message: function(){ //message for capped insulin
                        if (calcVars.insulin.isCapped()) return "*Insulin rate capped to " + inputs.insulin + " Units/kg/hour for " + settings.caps.weight + "kg.";
                        return "";
                    },
                },
            },
        },
        bolus: { //functions related to calculation of bolus volumes
            volumeUncapped: function(mlsPerKg){ //returns literal bolus volume based on given mL/kg for given patient weight
                return inputs.weight*mlsPerKg;
            },
            volumeCapped: function(){ //returns the set limit of the bolus volume
                return settings.caps.bolus;
            },
            isCapped: function(mlsPerKg){ //returns true if the uncapped bolus volume exceeds the cap
                if (this.volumeUncapped(mlsPerKg) > this.volumeCapped()) return true;
                return false;
            },
            volume: function(mlsPerKg){ //returns the bolus volume to be used, selecting between capped or uncapped volume
                if (this.isCapped(mlsPerKg)){
                    return this.volumeCapped();
                } else {
                    return this.volumeUncapped(mlsPerKg);
                }
            },
        },
        deficit: { //functions related to calculation of deficit
            percentage: function(){ //returns the percentage dehydration based on pH
                if(calcVars.patient.severity.isSevere()) return settings.severity.severe.deficitPercentage;
                if(calcVars.patient.severity.isModerate()) return settings.severity.moderate.deficitPercentage;
                if(calcVars.patient.severity.isMild()) return settings.severity.mild.deficitPercentage;
                throw new Error("Unable to select deficit.percentage");
            },
            volumeUncapped: function(){ //returns literal deficit volume based on percentage dehydration and patient weight
                return this.percentage()*inputs.weight*10;
            },
            volumeCapped: function(){ //returns the set limit of the bolus volume depending on dehydration percentage
                if (this.percentage() == 5) return settings.caps.deficit5;
                if (this.percentage() == 10) return settings.caps.deficit10;
                throw new Error("Unable to select deficit.volumeCapped");
            },
            isCapped: function(){ //returns true if the uncapped deficit volume exceeds the cap
                if (this.volumeUncapped() > this.volumeCapped()) return true;
                return false;
            },
            volume: function(){ //returns the deficit volume to be used, selecting between capped or uncapped volume
                if (this.isCapped()) return this.volumeCapped();
                return this.volumeUncapped();
            },
            bolusToSubtract: function(){ //returns a bolus volume to subtract, unless patient is shocked in which case boluses are not subtracted
                if(calcVars.patient.isShocked()) return 0;
                return calcVars.bolus.volume(10);
            },
            volumeLessBolus: function(){ //returns the deficit volume with bolus subtracted (if applicable)
                return this.volume() - this.bolusToSubtract(); //removed parseFloat
            },
            rate: function(){ //returns rate of deficit volume replacement to run over 48 hours (mL/hour)
                return calcVars.utilities.volumeToRate(this.volumeLessBolus(), 48);
            },
        },
        maintenance: { //functions related to calculation of maintenance
            volumeUncapped: function(){ //returns the daily fluid requirement using holliday-segar formula(mL)
                if(inputs.weight<10) return ((inputs.weight)*100);
                if(inputs.weight<20) return (((inputs.weight-10)*50)+1000);
                return (((inputs.weight-20)*20)+1500);
            },
            volumeCapped: function(){ //returns the maintenance cap
                return settings.caps.maintenance;
            },
            isCapped: function(){ //returns true if the uncapped volume exceeds the cap
                if(this.volumeUncapped() > this.volumeCapped()) return true;
                return false;
            },
            volume: function(){ //returns the maintenance volume to be used, selecting between capped or uncapped volume
                if(this.isCapped()) return this.volumeCapped();
                return this.volumeUncapped();
            },
            rate: function(){ //returns the maintenance fluid rate to run over 24 hours (mL/hour)
                return calcVars.utilities.volumeToRate(this.volume(), 24);
            },
        },
        startingFluidRate: function(){ //returns the starting fluid rate
            return calcVars.deficit.rate() + calcVars.maintenance.rate();
        },
        insulin: { //functions related to calculation of insulin rates
            rateUncapped: function(){ //returns the rate literal based on patient weight and selected insulin rate
                return inputs.insulin*inputs.weight;
            },
            rateCapped: function(){ //retuns the capped insulin rate for selected insulin rate option
                if (inputs.insulin == 0.05) return settings.caps.insulin005;
                if (inputs.insulin == 0.1) return settings.caps.insulin01; 
                throw new Error("Unable to seelect insulin.rateCapped");
            },
            isCapped: function(){ //returns true if uncapped rate exceeds cap
                if (this.rateUncapped() > this.rateCapped()) return true;
                return false;
            },
            rate: function(){ // returns the starting insulin rate (Units/hour), selecting between capped or uncapped rates
                if (this.isCapped()) return this.rateCapped();
                return this.rateUncapped();
            },
        },
    };
    return calcVars;
}
