const calcVars = getCalcVars(inputs);

const showWorking = {
    click: function(){
        var workingDisplay = "";
        for (calc in this.calcs) {
            workingDisplay = workingDisplay + '<style>.well {margin-bottom: 5px;}.bg-clear {background-color: transparent;}</style><div class="panel panel-info"><div class="panel-heading"><strong>' + this.calcs[calc].name + '</strong></div><div class="panel-body"><div class="row"><div class="col-md-2"><div class="well well-sm bg-clear"><strong>Formula:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].formula() + '</div></div>';
            if (!this.calcs[calc].limit().length == 0){
                workingDisplay = workingDisplay + '<div class="col-md-2"><div class="well well-sm bg-clear"><strong>Limit*:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].limit() + '</div></div>';
            }   
            workingDisplay = workingDisplay + '<div class="col-md-2"><div class="well well-sm bg-clear"><strong>Working:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].working() + '</div></div><div class="col-md-2"><div class="well well-sm bg-clear"><strong>Output:</strong></div></div><div class="col-md-10"><div class="well well-sm">' + this.calcs[calc].output() + '</div></div></div></div></div>';
        }
        workingDisplay = workingDisplay + "*limits set based on weight of " + calcVars.settings.caps.weight + "kg";
        bootbox.dialog({
            message: workingDisplay,
            size: 'large',
            backdrop: true,
            closeButton: false,
            buttons: {
                cancel: {
                    label: 'Close'
                }
            }
        });

    },
    calcs: {
        deficitPercentage: {
            name: "Deficit percentage",
            formula: function() {
                return "pH range [" + calcVars.settings.severity.mild.range.lower + " to " + calcVars.settings.severity.mild.range.upper + " = " + calcVars.settings.severity.mild.deficitPercentage + "%] or [" + calcVars.settings.severity.moderate.range.lower + " to " + calcVars.settings.severity.moderate.range.upper + " = " + calcVars.settings.severity.moderate.deficitPercentage + "%] or [" + calcVars.settings.severity.severe.range.lower + " to " + calcVars.settings.severity.severe.range.upper + " = " + calcVars.settings.severity.severe.deficitPercentage + "%]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                if (calcVars.patient.severity.isSevere()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + calcVars.settings.severity.severe.range.lower + " to " + calcVars.settings.severity.severe.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                if (calcVars.patient.severity.isModerate()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + calcVars.settings.severity.moderate.range.lower + " to " + calcVars.settings.severity.moderate.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                if (calcVars.patient.severity.isMild()) return "[pH " + inputs.pH.toFixed(2) + "] is in range [" + calcVars.settings.severity.mild.range.lower + " to " + calcVars.settings.severity.mild.range.upper + "] ==> " + calcVars.deficit.percentage() + "%";
                throw "unable to show working";
            },
            output: function() {
                return calcVars.deficit.percentage() + "%";
            },
        },
        deficitVolume: {
            name: "Deficit volume",
            formula: function() {
                return "[Deficit percentage] x [Patient weight (kg)] x 10";
            },
            limit: function() {
                if (calcVars.deficit.percentage() == 5) return calcVars.settings.caps.deficit5 + "mL (for 5% deficit)";
                if (calcVars.deficit.percentage() == 10) return calcVars.settings.caps.deficit10 + "mL (for 10% deficit)";
                throw "unable to select limit";
            },
            working: function() {
                var working = "[" + calcVars.deficit.percentage() + "%] x [" + inputs.weight + "kg] x 10 = " + calcVars.deficit.volumeUncapped() + "mL";
                if (calcVars.deficit.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.deficit.volume() + "mL";
            },
        },
        bolusVolume: {
            name: "Bolus volumes",
            formula: function() {
                return "[10mL/kg] x [Patient weight (kg)]";
            },
            limit: function() {
                return calcVars.bolus.volumeCapped() + "mL";
            },
            working: function() {
                var working = "[10mL/kg] x [" + inputs.weight + "kg] = " + calcVars.bolus.volumeUncapped(10) + "mL";
                if (calcVars.bolus.isCapped(10)) working = working + " (exceeds cap)"; //capped working
                return working;
            },
            output: function() {
               return calcVars.bolus.volume(10) + "mL";
            },
        },
        deficitVolumeLessBolus: {
            name: "Deficit volume less bolus",
            formula: function() {
                return "[Deficit volume] - [10mL/kg bolus (only for non-shocked patients)]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.volume() + "mL] - [" + calcVars.deficit.bolusToSubtract() + "mL] = " + calcVars.deficit.volumeLessBolus() + "mL";
            },
            output: function() {
                return calcVars.deficit.volumeLessBolus() + "mL";
            },
        },
        deficitReplacementRate: {
            name: "Deficit replacement rate",
            formula: function() {
                return "[Deficit volume less bolus] &#247; [48 hours]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.volumeLessBolus() + "mL] &#247; [48 hours] = " + calcVars.deficit.rate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.deficit.rate().toFixed(1) + "mL/hour";
            },
        },
        maintenanceVolume: {
            name: "Daily maintenance volume",
            formula: function() {
                return "[100mL/kg for 0-10kg] + [50mL/kg for 10-20kg] + [20mL/kg for >20kg]"
            },
            limit: function() {
                return calcVars.maintenance.volumeCapped() + "mL";
            },
            working: function() {
                if (inputs.weight < 10){
                    working = "[" + inputs.weight + "kg] x 100mL";
                } else if (inputs.weight <20){
                    working = "((["+inputs.weight+"kg] - 10kg) x 50mL) + 1000mL";
                } else {
                    working = "((["+inputs.weight+"kg] - 20kg) x 20mL) + 1500mL";
                }
                working = working + " = " + calcVars.maintenance.volumeUncapped() + "mL";
                if (calcVars.maintenance.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.maintenance.volume() + "mL";
            },
        },
        maintenanceRate: {
            name: "Maintenance rate",
            formula: function() {
                return "[Daily maintenance volume] &#247; [24 hours]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.maintenance.volume() + "mL] &#247; [24 hours] = " + calcVars.maintenance.rate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.maintenance.rate().toFixed(1) + "mL/hour";
            },
        },
        startingFluidRate: {
            name: "Starting fluid rate",
            formula: function() {
                return "[Deficit replacement rate] + [Maintenance rate]";
            },
            limit: function() {
                return "";
            },
            working: function() {
                return "[" + calcVars.deficit.rate().toFixed(1) + "mL/hour] + [" + calcVars.maintenance.rate().toFixed(1) + "mL/hour] = " + calcVars.startingFluidRate().toFixed(1) + "mL/hour";
            },
            output: function() {
                return calcVars.startingFluidRate().toFixed(1) + "mL/hour";
            },
        },
        insulinRate: {
            name: "Insulin infusion rate",
            formula: function() {
                return "[[Insulin rate (Units/kg/hour)] x [Patient weight]]";
            },
            limit: function() {
                if (inputs.insulin == 0.05) return calcVars.settings.caps.insulin005 + " Units/hour (for 0.05 Units/kg/hour)";
                if (inputs.insulin == 0.1) return calcVars.settings.caps.insulin01 + " Units/hour (for 0.1 Units/kg/hour)";
                throw "unable to select limit";
            },
            working: function() {
                var working = "[" + inputs.insulin + " Units/kg/hour] x [" + inputs.weight + "kg] = " + calcVars.insulin.rateUncapped() + " Units/hour";
                if (calcVars.insulin.isCapped()) working = working + " (exceeds cap)";
                return working;
            },
            output: function() {
                return calcVars.insulin.rate().toFixed(2) + " Units/hour";
            },
        },
    },
    addRow: function(rowNum, name, formula, working, output){
        var table = document.getElementById("table_showWorking");
        
        var row = table.insertRow(rowNum);
        
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        
        cell1.innerHTML = name;
        cell2.innerHTML = formula;
        cell3.innerHTML = working;
        cell4.innerHTML = output;
    },
}