function getDocumentVariables(inputs){

    const calculatorConstants = { //this contains static constants that can be altered to change the behaviour of the calculator
        
        severeDkaUpperLimit: 7.1, //pH must be below this value for DKA to be severe
        severeDkaLowerLimit: 6.5, //pH must be equal or above this value for DKA to be severe
        moderateDkaUpperLimit: 7.2, //pH must be below this value for DKA to be moderate
        moderateDkaLowerLimit: 7.1, //pH must be equal or above this value for DKA to be moderate
        mildDkaUpperLimit: 7.4, //pH must be below this value for DKA to be mild
        mildDkaLowerLimit: 7.2, //pH must be equal or above this value for DKA to be mild

        deficitPercentageSevere: 10, //percentage dehydration assumed if DKA is severe
        deficitPercentageModerate: 7, //percentage dehydration assumed if DKA is moderate
        deficitPercentageMild: 5, //percentage dehydration assumed if DKA is mild

        maxMaintenanceVolumeMale: 3000, //maximum allowed daily maintenance volume if patient is male
        maxMaintenanceVolumeFemale: 3000 //maximum allowed daily maintenance volume if patient is female
    }

    const indicatorCoordinates = { //this contains static constants that can be altered to change the position of the indicator boxes
        xAxisShockIndicatorYes: 205, //the x-axis position for the indicator box showing patient is shocked
        xAxisShockIndicatorNo: 358, //the x-axis position for the indicator box showing patient is not shocked

        yAxisSeverityIndicatorSevere: 68, //the y-axis position for the indicator box showing patient has severe DKA
        yAxisSeverityIndicatorModerate: 103, //the y-axis position for the indicator box showing patient has moderate DKA
        yAxisSeverityIndicatorMild: 138, //the y-axis position for the indicator box showing patient has mild DKA
        
        xAxisDiabeticIndicatorYes: 200, //the x-axis position for the indicator box showing patient has pre-existing diabetes
        xAxisDiabeticIndicatorNo: 358, //the x-axis position for the indicator box showing patient does not have pre-existing diabetes
    }

    var documentVariables = { //recieves inputs and returns object with required variables as below for building the documentDefinition
        isMale: function() {
            if(inputs.sex==="Male") return true;
            if(inputs.sex==="Female") return false;
            console.log ('Unable to select sex');
        },

        volumeToRate: function(volume, hours){//takes a volume in mL and divides by number of hours over which it should run to give a rate in mL/hour
            return volume/hours;
        },

        bolusVolume: function(mlsPerKg){ //receives bolus volume in mL/kg and converts this into literal volume for given patient weight
            return inputs.weight*mlsPerKg;  
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

        severityIsSevere: function(){ //if patient's pH meets criteria for severe DKA returns true
            if(inputs.pH<calculatorConstants.severeDkaUpperLimit&&inputs.pH>=calculatorConstants.severeDkaLowerLimit) return true;
            return false;
        },

        severityIsModerate: function(){ //if patient's pH meets criteria for moderate DKA returns true
            if(inputs.pH<calculatorConstants.moderateDkaUpperLimit&&inputs.pH>=calculatorConstants.moderateDkaLowerLimit) return true;
            return false;
        },

        severityIsMild: function(){ //if patient's pH meets criteria for mild DKA returns true
            if(inputs.pH>=calculatorConstants.mildDkaLowerLimit&&inputs.pH<=calculatorConstants.mildDkaUpperLimit) return true;
            return false;
        },
        
        deficitPercentage: function(){ //selects between the different estimated percentage dehydration by evaluating patient's pH against ranges for severe/moderate/mild DKA and returns percentage dehydration as integer
            if(this.severityIsSevere()) return calculatorConstants.deficitPercentageSevere;
            if(this.severityIsModerate()) return calculatorConstants.deficitPercentageModerate;
            if(this.severityIsMild()) return calculatorConstants.deficitPercentageMild;
            console.log('Unable to select severity');
        },

        deficitVolume: function(){ //takes deficit percentage and patient weight and returns the volume in mL that this equals
            return (this.deficitPercentage()*inputs.weight*10); 
        },

        bolusVolumeToSubtract: function(){ //selects between bolus volumes that should be subtracted from the deficit, boluses given to shocked patients not subtracted so 0, else 10ml/kg bolus is subtracted
            if(this.isShocked()) return 0;
            return this.bolusVolume(10);
        },

        deficitVolumeLessBolus: function(){ //calculates volume of deficit that will be replaced over deficit replacement period by subtracting relevant bolus volumes
            return parseFloat(this.deficitVolume())-parseFloat(this.bolusVolumeToSubtract());
        },

        deficitRate: function(){ //returns rate of deficit volume replacement to run over 48 hours
            return this.volumeToRate(this.deficitVolumeLessBolus(), 48);
        },

        hollidaySegar: function(){ //returns the daily fluid requirement using holliday-segar formula
            if(inputs.weight<10) return ((inputs.weight)*100);
            if(inputs.weight<20) return (((inputs.weight-10)*50)+1000);
            if(inputs.weight<150) return (((inputs.weight-20)*20)+1500);
            console.log('Unable to calculate holliday segar volume');
        },

        maxMaintenanceVolume: function(){ //returns maximum acceptable daily maintenance volume for sex
            if(this.isMale()) return calculatorConstants.maxMaintenanceVolumeMale;
            return calculatorConstants.maxMaintenanceVolumeFemale;
        },

        maintenanceVolume: function(){ //returns holliday-segar volume or the maximum daily maintenance volume
            if(this.hollidaySegar()>this.maxMaintenanceVolume()) return this.maxMaintenanceVolume();
            return this.hollidaySegar()
        },

        maintenanceRate: function(){ //returns the maintenance fluid rate to run over 24 hours
            return this.volumeToRate(this.maintenanceVolume(), 24);
        },

        fluidRate: function(){ //returns to starting fluid rate by adding maintenance and deficit replacement rates
            return parseFloat(this.deficitRate())+parseFloat(this.maintenanceRate());
        },

        insulinRate: function(){ //returns insulin starting rate
            return parseFloat(inputs.insulin)*parseFloat(inputs.weight);    
        },

        timingTime: function(addHours){ //returns time component of datetime; addHours after protocolStart
        return moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('HH:mm');
        },

        timingDate: function(addHours){ //returns date component of datetime; addHours after protocolStart
            var output = moment(inputs.protocolStart, 'DD/MM/YYYY HH:mm').add(addHours, 'hours').format('DD/MM/YYYY');
            return output;
        },

        xAxisShockIndicator: function(){ //returns x-axis coordinate for the indicator box showing if patient is shocked or not
            if(this.isShocked()) return indicatorCoordinates.xAxisShockIndicatorYes;
            return indicatorCoordinates.xAxisShockIndicatorNo;
        },

        yAxisSeverityIndicator: function(){ //returns y-axis coordinate for the indicator box showing severity of DKA
            if(this.severityIsSevere()) return indicatorCoordinates.yAxisSeverityIndicatorSevere;
            if(this.severityIsModerate()) return indicatorCoordinates.yAxisSeverityIndicatorModerate;
            if(this.severityIsMild()) return indicatorCoordinates.yAxisSeverityIndicatorMild;
            console.log('Unable to select severity');
        },

        xAxisDiabeticIndicator: function(){ //returns x-axis coordinate for the indicator box showing if patient had pre-existing diabetes
            if(this.isDiabetic()) return indicatorCoordinates.xAxisDiabeticIndicatorYes;
            return indicatorCoordinates.xAxisDiabeticIndicatorNo;
        }
    }

    return documentVariables;
}