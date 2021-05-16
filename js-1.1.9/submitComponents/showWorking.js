function showWorking(){

    document.getElementById("div_showWorking").innerHTML = "<br><table id='table_showWorking'><tr><th>Variable</th><th>Formula</th><th>Working</th><th>Output</th></tr></table>*Holliday-Segar Formula: 100mL/kg for first 10kg, 50mL/kg for second 10kg, 20mL/kg thereafter<br><br>";

    const documentVariables = getDocumentVariables(inputs);
    var rowNum = 0;
    var variable = "";
    var formula = "";
    var working = "";
    var output = "";

    rowNum ++;
    variable = "Deficit percentage";
    formula = "pH range [7.20 to 7.40 = 5%] or [7.10 to 7.19 = 7%] or [6.50 to 7.09 = 10%]";
    working = "[pH " + inputs.pH.toFixed(1) + "] is in range ";
    switch (documentVariables.deficitPercentage()){
        case 5:
            working += "[7.20 to 7.40]";
            break;
        case 7:
            working += "[7.10 to 7.19]";
            break;
        case 10:
            working += "[6.40 to 7.09]";
            break;
        default:
            working += "error";
            break;
    }
    output = documentVariables.deficitPercentage() + "%"
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit volume";
    formula = "[Deficit percentage] x [Patient weight] x 10";
    working = "[" + documentVariables.deficitPercentage() + "%] x [" + inputs.weight + "kg] x 10";
    output = documentVariables.deficitVolume() + "mL";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit volume less bolus";
    formula = "[Deficit volume] - [10mL/kg bolus (only for non-shocked patients)]";
    working = "[" + documentVariables.deficitVolume() + "mL] - [";
    switch (inputs.shock){
        case "Yes":
            working += 0 + "mL]";
            break;
        case "No":
            working += documentVariables.bolusVolume(10) + "mL]";
            break;
    }
    output = documentVariables.deficitVolumeLessBolus() + "mL";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Deficit replacement rate";
    formula = "[Deficit volume less bolus] &#247; [48 hours]";
    working = "[" + documentVariables.deficitVolumeLessBolus() + "mL] &#247; [48 hours]";
    output = documentVariables.deficitRate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Daily maintenance volume";
    formula = "[Holliday-Segar Formula*] or [upper limit of 3000mL]";
    if (documentVariables.hollidaySegar()>3000){
        working = "[Holliday-Segar Formula = " + documentVariables.hollidaySegar() + "] > 3000mL";
    } else {
        if (inputs.weight < 10){
            working = "[" + inputs.weight + "kg x 100mL]";
        } else if (inputs.weight <20){
            working = "[(("+inputs.weight+"kg - 10kg) x 50mL) + 1000mL]";
        } else {
        working = "[(("+inputs.weight+"kg - 20kg) x 20mL) + 1500mL]";
        }
    }
    output = documentVariables.maintenanceVolume() + "mL";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Maintenance rate";
    formula = "[Daily maintenance volume] &#247; [24 hours]";
    working = "[" + documentVariables.maintenanceVolume() + "mL] &#247; [24 hours]";
    output = documentVariables.maintenanceRate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Starting fluid rate";
    formula = "[Deficit replacement rate] + [Maintenance rate]";
    working = "[" + documentVariables.deficitRate().toFixed(1) + "mL/hour] + [" + documentVariables.maintenanceRate().toFixed(1) + "mL/hour]";
    output = documentVariables.fluidRate().toFixed(1) + "mL/hour";
    addRow(rowNum, variable, formula, working, output);

    rowNum ++;
    variable = "Insulin infusion rate";
    formula = "[Insulin rate (Units/kg/hour)] x [Patient weight]";
    working = "[" + inputs.insulin + " Units/kg/hour] x [" + inputs.weight + "kg]";
    output =  documentVariables.insulinRate().toFixed(1) + " Units/hour";
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