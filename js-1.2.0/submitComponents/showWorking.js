function showWorking(){
    
    document.getElementById("div_showWorking").innerHTML = "<br><table id='table_showWorking'><tr><th>Variable</th><th>Formula</th><th>Working</th><th>Output</th></tr></table>*Holliday-Segar Formula: 100mL/kg for first 10kg, 50mL/kg for second 10kg, 20mL/kg thereafter.<br>&dagger;Capped to maximum limit equivalent to 75kg patient.<br><br>";

    const calcVars = getCalcVars(inputs);
    
    var rowNum = 0;
    var variable = "";
    var formula = "";
    var working = "";
    var output = "";

    rowNum ++;
    variable = "Deficit percentage";
    formula = "pH range [" + calcVars.settings.severity.mild.range.lower + " to " + calcVars.settings.severity.mild.range.upper + " = " + calcVars.settings.severity.mild.deficitPercentage + "%] or [" + calcVars.settings.severity.moderate.range.lower + " to " + calcVars.settings.severity.moderate.range.upper + " = " + calcVars.settings.severity.moderate.deficitPercentage + "%] or [" + calcVars.settings.severity.severe.range.lower + " to " + calcVars.settings.severity.severe.range.upper + " = " + calcVars.settings.severity.severe.deficitPercentage + "%]";
    working = "[pH " + inputs.pH.toFixed(2) + "] is in range ";
    if ((inputs.pH >= calcVars.settings.severity.mild.range.lower) && (inputs.pH < calcVars.settings.severity.mild.range.upper)){
        working += "[" + calcVars.settings.severity.mild.range.lower + " to " + calcVars.settings.severity.mild.range.upper + "]";
    } else if ((inputs.pH >= calcVars.settings.severity.moderate.range.lower) && (inputs.pH < calcVars.settings.severity.moderate.range.upper)){
        working += "[" + calcVars.settings.severity.moderate.range.lower + " to " + calcVars.settings.severity.moderate.range.upper + "]";
    } else if ((inputs.pH >= calcVars.settings.severity.severe.range.lower) && (inputs.pH < calcVars.settings.severity.severe.range.upper)){
        working += "[" + calcVars.settings.severity.severe.range.lower + " to " + calcVars.settings.severity.severe.range.upper + "]";
    } else {
        working += "[error]"; //throw error here TO DO
    }
    output = calcVars.deficit.percentage() + "%";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit volume";
    formula = "[[Deficit percentage] x [Patient weight] x 10] or [Upper limit (if 5% deficit) " + calcVars.settings.caps.deficit5 + "mL] or [Upper limit (if 10% deficit) " + calcVars.settings.caps.deficit10 + "mL]";
    working = "[" + calcVars.deficit.percentage() + "%] x [" + inputs.weight + "kg] x 10";
    output = calcVars.deficit.volume() + "mL";
    if (calcVars.deficit.isCapped()) {
        working = working + " is >" + calcVars.deficit.volumeCapped() + "mL";
        output = output + "&dagger;";
    }
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Bolus volumes";
    formula = "[10mL/kg x [Patient weight] or [Upper limit " + calcVars.bolus.volumeCapped() + "mL]";
    working = "[10mL/kg] x [" + inputs.weight + "kg]";
    output = calcVars.bolus.volume(10) + "mL";
    if (calcVars.bolus.isCapped(10)){
        working = working + " is >" + calcVars.bolus.volumeCapped() + "mL";
        output = output + "&dagger;";
    }
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit volume less bolus";
    formula = "[Deficit volume] - [10mL/kg bolus (only for non-shocked patients)]";
    working = "[" + calcVars.deficit.volume() + "mL] - [" + calcVars.deficit.bolusToSubtract() + "]";
    output = calcVars.deficit.volumeLessBolus() + "mL";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit replacement rate";
    formula = "[Deficit volume less bolus] &#247; [48 hours]";
    working = "[" + calcVars.deficit.volumeLessBolus() + "mL] &#247; [48 hours]";
    output = calcVars.deficit.rate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Daily maintenance volume";
    formula = "[Holliday-Segar Formula*] or [Upper limit of " + calcVars.maintenance.volumeCapped() + "mL]";
    if (inputs.weight < 10){
        working = "[" + inputs.weight + "kg x 100mL]";
    } else if (inputs.weight <20){
        working = "[(("+inputs.weight+"kg - 10kg) x 50mL) + 1000mL]";
    } else {
        working = "[(("+inputs.weight+"kg - 20kg) x 20mL) + 1500mL]";
    }
    output = calcVars.maintenance.volume() + "mL";
    if (calcVars.maintenance.isCapped()) {
        working = working + " is >" + calcVars.maintenance.volumeCapped() + "mL";
        output = output + "&dagger;";
    }
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Maintenance rate";
    formula = "[Daily maintenance volume] &#247; [24 hours]";
    working = "[" + calcVars.maintenance.volume() + "mL] &#247; [24 hours]";
    output = calcVars.maintenance.rate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Starting fluid rate";
    formula = "[Deficit replacement rate] + [Maintenance rate]";
    working = "[" + calcVars.deficit.rate().toFixed(1) + "mL/hour] + [" + calcVars.maintenance.rate().toFixed(1) + "mL/hour]";
    output = calcVars.startingFluidRate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Insulin infusion rate";
    formula = "[[Insulin rate (Units/kg/hour)] x [Patient weight]] or [Upper limit (if using 0.05 Units/kg/hour) " + calcVars.settings.caps.insulin005 + " Units/hour] or [Upper limit (if using 0.1 Units/kg/hour) " + calcVars.settings.caps.insulin01 + " Units/hour]";
    working = "[" + inputs.insulin + " Units/kg/hour] x [" + inputs.weight + "kg]";
    output =  calcVars.insulin.rate().toFixed(2) + " Units/hour";
    if (calcVars.insulin.isCapped()){
        working = working + " is >" + calcVars.insulin.rateCapped() + " Units/hour";
        output = output + "&dagger;";
    }
    addRow(rowNum, variable, formula, working, output);
}

function addRow(rowNum, variable, formula, working, output){
    var table = document.getElementById("table_showWorking");
    
    var row = table.insertRow(rowNum);
    
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    
    cell1.innerHTML = variable;
    cell2.innerHTML = formula;
    cell3.innerHTML = working;
    cell4.innerHTML = output;
}