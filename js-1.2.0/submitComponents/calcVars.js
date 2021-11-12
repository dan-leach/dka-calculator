function getCalcVars(inputs){
    var calcVars = { //recieves inputs and returns object with required variables as below for building the documentDefinition
        settings: {
            severity: {
                severe: {
                    range: {
                        upper: 7.1, //pH must be below this value for DKA to be severe
                        lower: 6.5, //pH must be equal or above this value for DKA to be severe
                    },
                    deficitPercentage: 10,
                },
                moderate: {
                    range: {
                        upper: 7.2, //pH must be below this value for DKA to be moderate
                        lower: 7.1, //pH must be equal or above this value for DKA to be moderate
                    },
                    deficitPercentage: 5,
                },
                mild: {
                    range: {
                        upper: 7.4, //pH must be below this value for DKA to be mild
                        lower: 7.2, //pH must be equal or above this value for DKA to be mild
                    },
                    deficitPercentage: 5,
                },
            },
            caps: {
                weight: 75, //weight limit
                maintenance: 2600, //maximum allowed daily maintenance volume
                deficit10: 7500, //maximum allowed total deficit volume for 10% deficit
                deficit5: 3750, //maximum allowed total deficit volume for 5% deficit
                bolus: 750, //maximum allowed bolus volume
                insulin01: 7.5, //maximum allowed insulin rate in units/hour for 0.1 units/kg/hr
                insulin005: 3.75, //maximum allowed insulin rate in units/hour for 0.05 units/kg/hr
            },
            indicatorCoordinates: { //this contains static constants that can be altered to change the position of the indicator boxes
                xAxisShock: {
                    yes: 205, //the x-axis position for the indicator box showing patient is shocked
                    no: 358, //the x-axis position for the indicator box showing patient is not shocked
                },
                yAxisSeverity: {
                    severe: 68, //the y-axis position for the indicator box showing patient has severe DKA
                    moderate: 103, //the y-axis position for the indicator box showing patient has moderate DKA
                    mild: 138, //the y-axis position for the indicator box showing patient has mild DKA
                },
                xAxisDiabetic: {
                    yes: 200, //the x-axis position for the indicator box showing patient has pre-existing diabetes
                    no: 358, //the x-axis position for the indicator box showing patient does not have pre-existing diabetes
                },
            },
        },
        patient: {
            isMale: function() {
                if(inputs.sex==="Male") return true;
                if(inputs.sex==="Female") return false;
                console.log ('Unable to select sex');
            },
            isDiabetic: function(){ //if patient is had pre-existing diabetes returns true
                if(inputs.preDM==="Yes") return true;
                if(inputs.preDM==="No") return false;
                console.log('Unable to select if is diabetic');
            },
            isShocked: function(){ //if patient is being managed on shocked arm of resusitation flow chart returns true
                if(inputs.shock==="Yes") return true;
                if(inputs.shock==="No") return false;
                console.log('Unable to select if is shocked');
            },
            severity: {
                isSevere: function(){ //if patient's pH meets criteria for severe DKA returns true
                    if((inputs.pH < calcVars.settings.severity.severe.range.upper) && (inputs.pH >= calcVars.settings.severity.severe.range.lower)) return true;
                    return false;
                },
                isModerate: function(){ //if patient's pH meets criteria for moderate DKA returns true
                    if((inputs.pH < calcVars.settings.severity.moderate.range.upper) && (inputs.pH >= calcVars.settings.severity.moderate.range.lower)) return true;
                    return false;
                },
                isMild: function(){ //if patient's pH meets criteria for mild DKA returns true
                    if((inputs.pH < calcVars.settings.severity.mild.range.upper) && (inputs.pH >= calcVars.settings.severity.mild.range.lower)) return true;
                    return false;
                },
            },
        },
        utilities: {
            volumeToRate: function(volume, hours){//takes a volume in mL and divides by number of hours over which it should run to give a rate in mL/hour
                return volume/hours;
            },
            timing: {
                time: function(addHours){ //returns time component of datetime; addHours after protocolStart
                    return moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('HH:mm');
                },
                date: function(addHours){ //returns date component of datetime; addHours after protocolStart
                    return moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('DD/MM/YYYY');
                },
            },
            indicatorCoordinates: {
                xAxisShock: function(){ //returns x-axis coordinate for the indicator box showing if patient is shocked or not
                    if(calcVars.patient.isShocked()) return calcVars.settings.indicatorCoordinates.xAxisShock.yes;
                    return calcVars.settings.indicatorCoordinates.xAxisShock.no;
                },
                yAxisSeverity: function(){ //returns y-axis coordinate for the indicator box showing severity of DKA
                    if(calcVars.patient.severity.isSevere()) return calcVars.settings.indicatorCoordinates.yAxisSeverity.severe;
                    if(calcVars.patient.severity.isModerate()) return calcVars.settings.indicatorCoordinates.yAxisSeverity.moderate;
                    if(calcVars.patient.severity.isMild()) return calcVars.settings.indicatorCoordinates.yAxisSeverity.mild;
                    console.log('Unable to select severity');
                },
                xAxisDiabetic: function(){ //returns x-axis coordinate for the indicator box showing if patient had pre-existing diabetes
                    if(calcVars.patient.isDiabetic()) return calcVars.settings.indicatorCoordinates.xAxisDiabetic.yes;
                    return calcVars.settings.indicatorCoordinates.xAxisDiabetic.no;
                },
            },
            capAlert: {
                bolus: {
                    asterisk: function(){ //xxxxxxx
                        if (calcVars.bolus.isCapped(10)) return "*";
                        return "";
                    },
                    message: function(){ //xxxxxxx
                        if (calcVars.bolus.isCapped(10)) return "*Bolus capped to 10mL/kg for " + calcVars.settings.caps.weight + "kg.";
                        return "";
                    },
                },
                deficit: {
                    asterisk: function(){
                        if (calcVars.deficit.isCapped()) return "*";
                    },
                    message: function(){ //xxxxxxx
                        if (calcVars.deficit.isCapped()) return "*Deficit capped to volume for " + calcVars.settings.caps.weight + "kg with " + calcVars.deficit.percentage() + "% dehydration.";
                        return "";
                    },
                },
                maintenance: {
                    asterisk: function(){
                        if (calcVars.maintenance.isCapped()) return "*";
                    },
                    message: function(){ //xxxxxxx
                        if (calcVars.maintenance.isCapped()) return "*Maintenance capped to volume for " + calcVars.settings.caps.weight + "kg.";
                        return "";
                    },
                },
                insulin: {
                    asterisk: function(){
                        if (calcVars.insulin.isCapped()) return "*";
                    },
                    message: function(){ //xxxxxxx
                        if (calcVars.insulin.isCapped()) return "*Insulin rate capped to " + inputs.insulin + " Units/kg/hour for " + calcVars.settings.caps.weight + "kg.";
                        return "";
                    },
                },
            },
        },
        bolus: {
            volumeUncapped: function(mlsPerKg){
                return inputs.weight*mlsPerKg;
            },
            volumeCapped: function(){
                return calcVars.settings.caps.bolus;
            },
            isCapped: function(mlsPerKg){
                if (this.volumeUncapped(mlsPerKg) > this.volumeCapped()) return true;
                return false;
            },
            volume: function(mlsPerKg){ //receives bolus volume in mL/kg and converts this into literal volume for given patient weight, providing this does not exceed cap
                if (this.isCapped(mlsPerKg)){
                    return this.volumeCapped();
                } else {
                    return this.volumeUncapped(mlsPerKg);
                }
            },
        },
        deficit: {
            percentage: function(){ //selects between the different estimated percentage dehydration by evaluating patient's pH against ranges for severe/moderate/mild DKA and returns percentage dehydration as integer
                if(calcVars.patient.severity.isSevere()) return calcVars.settings.severity.severe.deficitPercentage;
                if(calcVars.patient.severity.isModerate()) return calcVars.settings.severity.moderate.deficitPercentage;
                if(calcVars.patient.severity.isMild()) return calcVars.settings.severity.mild.deficitPercentage;
            },
            volumeUncapped: function(){
                return this.percentage()*inputs.weight*10;
            },
            volumeCapped: function(){
                if (this.percentage() == 5) return calcVars.settings.caps.deficit5;
                if (this.percentage() == 10) return calcVars.settings.caps.deficit10;
                console.log('Error: function ID(TO DO)');
            },
            isCapped: function(){
                if (this.volumeUncapped() > this.volumeCapped()) return true;
                return false;
            },
            volume: function(){ //takes deficit percentage and patient weight and returns the volume in mL that this equals, providing this does not exceed cap
                if (this.isCapped()) return this.volumeCapped();
                return this.volumeUncapped();
            },
            bolusToSubtract: function(){ //selects between bolus volumes that should be subtracted from the deficit, boluses given to shocked patients not subtracted so 0, else 10ml/kg bolus is subtracted
                if(calcVars.patient.isShocked()) return 0;
                return calcVars.bolus.volume(10);
            },
            volumeLessBolus: function(){ //calculates volume of deficit that will be replaced over deficit replacement period by subtracting relevant bolus volumes
                return this.volume() - this.bolusToSubtract(); //removed parseFloat
            },
            rate: function(){ //returns rate of deficit volume replacement to run over 48 hours
                return calcVars.utilities.volumeToRate(this.volumeLessBolus(), 48);
            },
        },
        maintenance: {
            volumeUncapped: function(){ //returns the daily fluid requirement using holliday-segar formula
                if(inputs.weight<10) return ((inputs.weight)*100);
                if(inputs.weight<20) return (((inputs.weight-10)*50)+1000);
                return (((inputs.weight-20)*20)+1500);
            },
            volumeCapped: function(){
                return calcVars.settings.caps.maintenance;
            },
            isCapped: function(){
                if(this.volumeUncapped() > this.volumeCapped()) return true;
                return false;
            },
            volume: function(){
                if(this.isCapped()) return this.volumeCapped();
                return this.volumeUncapped();
            },
            rate: function(){ //returns the maintenance fluid rate to run over 24 hours
                return calcVars.utilities.volumeToRate(this.volume(), 24);
            },
        },
        startingFluidRate: function(){
            return calcVars.deficit.rate() + calcVars.maintenance.rate(); //removed parseFloat
        },
        insulin: {
            rateUncapped: function(){
                return inputs.insulin*inputs.weight;
            },
            rateCapped: function(){
                if (inputs.insulin == 0.05) return calcVars.settings.caps.insulin005;
                if (inputs.insulin == 0.1) return calcVars.settings.caps.insulin01; 
                return "error";
            },
            isCapped: function(){
                if (this.rateUncapped() > this.rateCapped()) return true;
                return false;
            },
            rate: function(){
                if (this.isCapped()) return this.rateCapped();
                return this.rateUncapped();
            },
        },
    }
    return calcVars;
}
