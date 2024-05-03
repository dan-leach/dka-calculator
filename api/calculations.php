<?php

$settingsJSON = file_get_contents('settings.json');
$settings = json_decode($settingsJSON);

function volumeToRate($volume, $unitTime){ //takes a volume and divides by number of unitTime over which it should run to give a rate in volumeUnit/unitTime
    return $volume/$unitTime;
};

//severity
if (isset($data->ketones)) {
    if ($data->ketones < $settings->minimumKetones) send_error_response('Ketones of ' . $data->ketones . ' mmol/L are below the diagnostic threshold for DKA of ' . $settings->minimumKetones . ' mmol/L.' , 400);
}
if (($data->pH < $settings->severity->severe->pHRange->upper) && ($data->pH >= $settings->severity->severe->pHRange->lower)) {
    $calculations->severity = "severe";
} else if ((isset($data->bicarbonate)) && ($data->bicarbonate < $settings->severity->severe->bicarbonateBelow)) {
    $calculations->severity = "severe";
} else if (($data->pH < $settings->severity->moderate->pHRange->upper) && ($data->pH >= $settings->severity->moderate->pHRange->lower)) {
    $calculations->severity = "moderate";
} else if ((isset($data->bicarbonate)) && ($data->bicarbonate < $settings->severity->moderate->bicarbonateBelow)) {
    $calculations->severity = "moderate";
} else if (($data->pH <= $settings->severity->mild->pHRange->upper) && ($data->pH >= $settings->severity->mild->pHRange->lower)) {
    $calculations->severity = "mild";
} else if ((isset($data->bicarbonate)) && ($data->bicarbonate < $settings->severity->mild->bicarbonateBelow)) {
    $calculations->severity = "mild";
} else {
    send_error_response('pH of ' . $data->pH . ' and bicarbonate of ' . $data->bicarbonate . ' mmol/L does not meet the diagnostic threshold for DKA. ' , 400);
}

//functions related to calculation of bolus volumes
function bolusVolumeUncapped($mlsPerKg){ //returns literal bolus volume based on given mL/kg for given patient weight
    global $data;
    return $data->weight*$mlsPerKg;
}
function bolusVolumeCapped(){ //returns the set limit of the bolus volume
    global $settings;
    return $settings->caps->bolus;
}
function bolusVolumeIsCapped($mlsPerKg){ //returns true if the uncapped bolus volume exceeds the cap
    if (bolusVolumeUncapped($mlsPerKg) > bolusVolumeCapped()) return true;
    return false;
}
function bolusVolume($mlsPerKg){ //returns the bolus volume to be used, selecting between capped or uncapped volume
    if (bolusVolumeIsCapped($mlsPerKg)){
        return bolusVolumeCapped();
    } else {
        return bolusVolumeUncapped($mlsPerKg);
    }
}
function bolusVolumeFormula($mlsPerKg) {
    return "[".$mlsPerKg."mL/kg] x [Patient weight (kg)]";
}
function bolusVolumeLimit($mlsPerKg) {
    global $settings;
    return $settings->caps->bolus . "mL";
}
function bolusVolumeWorking($mlsPerKg) {
    return "[".$mlsPerKg."mL/kg] x [".$data->weight."kg] = ".bolusVolume($mlsPerKg)."mL";
}
$calculations->bolusVolume = new StdClass;
$calculations->bolusVolume->val = bolusVolume($settings->bolusMlsPerKg);
$calculations->bolusVolume->isCapped = bolusVolumeIsCapped($settings->bolusMlsPerKg);
$calculations->bolusVolume->formula = bolusVolumeFormula($settings->bolusMlsPerKg);
$calculations->bolusVolume->limit = bolusVolumeLimit($settings->bolusMlsPerKg);
$calculations->bolusVolume->working = bolusVolumeWorking($settings->bolusMlsPerKg);

//functions related to calculation of deficit percentage
function deficitPercentage(){ //returns the percentage dehydration based on pH
    global $calculations;
    global $settings;
    if($calculations->severity == "severe") return $settings->severity->severe->deficitPercentage;
    if($calculations->severity == "moderate") return $settings->severity->moderate->deficitPercentage;;
    if($calculations->severity == "mild") return $settings->severity->mild->deficitPercentage;
    send_error_response('Unable to select deficit percentage.' , 400);
}
function deficitPercentageFormula(){
    global $settings;
    return "[pH] in range ".$settings->severity->mild->pHRange->lower." to ".$settings->severity->mild->pHRange->upper." or [bicarbonate] <".$settings->severity->mild->bicarbonateBelow."mmol/L ==> ".$settings->severity->mild->deficitPercentage."%<br>[pH] in range ".$settings->severity->moderate->pHRange->lower." to ".$settings->severity->moderate->pHRange->upper." or [bicarbonate] <".$settings->severity->moderate->bicarbonateBelow."mmol/L ==> ".$settings->severity->moderate->deficitPercentage."%<br>[pH] in range ".$settings->severity->severe->pHRange->lower." to ".$settings->severity->severe->pHRange->upper." or [bicarbonate] <".$settings->severity->severe->bicarbonateBelow."mmol/L ==> ".$settings->severity->severe->deficitPercentage."%";
}
function deficitPercentageWorking(){
    global $calculations;
    global $settings;
    global $data;
    if($calculations->severity == "severe") return "[pH $data->pH] is in range ".$settings->severity->severe->pHRange->lower." to ".$settings->severity->severe->pHRange->upper." or [bicarbonate ".(($data->bicarbonate) ? $data->bicarbonate . 'mmol/L' : 'not provided')."] is <".$settings->severity->severe->bicarbonateBelow."mmol/L ==> ".$settings->severity->severe->deficitPercentage."%";
    if($calculations->severity == "moderate") return "[pH $data->pH] is in range ".$settings->severity->moderate->pHRange->lower." to ".$settings->severity->moderate->pHRange->upper." or [bicarbonate ".(($data->bicarbonate) ? $data->bicarbonate . 'mmol/L' : 'not provided')."] is <".$settings->severity->moderate->bicarbonateBelow."mmol/L ==> ".$settings->severity->moderate->deficitPercentage."%";
    if($calculations->severity == "mild") return "[pH $data->pH] is in range ".$settings->severity->mild->pHRange->lower." to ".$settings->severity->mild->pHRange->upper." or [bicarbonate ".(($data->bicarbonate) ? $data->bicarbonate . 'mmol/L' : 'not provided')."] is <".$settings->severity->severe->bicarbonateBelow."mmol/L ==> ".$settings->severity->mild->deficitPercentage."%";
}
$calculations->deficit = new StdClass;
$calculations->deficit->percentage = new StdClass;
$calculations->deficit->percentage->val = deficitPercentage();
$calculations->deficit->percentage->formula = deficitPercentageFormula();
$calculations->deficit->percentage->working = deficitPercentageWorking();

//functions related to calculation of deficit volume
function deficitVolumeUncapped(){ //returns literal deficit volume based on percentage dehydration and patient weight
    global $data;
    return deficitPercentage()*$data->weight*10;
}
function deficitVolumeCapped(){ //returns the set limit of the bolus volume depending on dehydration percentage
    global $settings;
    if (deficitPercentage() == 5) return $settings->caps->deficit5;
    if (deficitPercentage() == 10) return $settings->caps->deficit10;
    send_error_response('Unable to select deficit.volumeCapped. ' , 400);
}
function deficitVolumeIsCapped(){ //returns true if the uncapped deficit volume exceeds the cap
    if (deficitVolumeUncapped() > deficitVolumeCapped()) return true;
    return false;
}
function deficitVolume(){ //returns the deficit volume to be used, selecting between capped or uncapped volume
    if (deficitVolumeIsCapped()) return deficitVolumeCapped();
    return deficitVolumeUncapped();
}
function deficitVolumeFormula(){
    return "[Deficit percentage] x [Patient weight] x 10";
}
function deficitVolumeLimit(){
    global $settings;
    if (deficitPercentage() == 5) return $settings->caps->deficit5."mL (for 5% deficit)"; 
    if (deficitPercentage() == 10) return $settings->caps->deficit10."mL (for 10% deficit)";
}
function deficitVolumeWorking(){
    global $data;
    return "[".deficitPercentage()."%] x [".$data->weight."kg] x 10 = ".deficitVolumeUncapped()."mL ".(deficitVolumeIsCapped() ? '(exceeds limit)' : '');
}
$calculations->deficit->volume = new StdClass;
$calculations->deficit->volume->val = deficitVolume();
$calculations->deficit->volume->formula = deficitVolumeFormula();
$calculations->deficit->volume->limit = deficitVolumeLimit();
$calculations->deficit->volume->working = deficitVolumeWorking();
$calculations->deficit->volume->isCapped = deficitVolumeIsCapped();

//functions related to calculation of deficit volume less bolus
function deficitBolusToSubtract(){ //returns a bolus volume to subtract, unless patient is shocked in which case boluses are not subtracted
    global $data;
    global $settings;
    if($data->shockPresent == "true") return 0;
    return bolusVolume($settings->bolusMlsPerKg);
}
function deficitVolumeLessBolus(){ //returns the deficit volume with bolus subtracted (if applicable)
    return deficitVolume() - deficitBolusToSubtract();
}
function deficitVolumeLessBolusFormula() {
    return "[Deficit volume] - [10mL/kg bolus (only for non-shocked patients)]";
}
function deficitVolumeLessBolusWorking(){
    return "[".deficitVolume()."mL] - [".deficitBolusToSubtract()."ml] = ".deficitVolumeLessBolus()."mL";
}
$calculations->deficit->volumeLessBolus = new StdClass;
$calculations->deficit->volumeLessBolus->bolusToSubtract = deficitBolusToSubtract();
$calculations->deficit->volumeLessBolus->val = deficitVolumeLessBolus();
$calculations->deficit->volumeLessBolus->formula = deficitVolumeLessBolusFormula();
$calculations->deficit->volumeLessBolus->working = deficitVolumeLessBolusWorking();

//functions related to calculation of deficit rate
function deficitRate(){ //returns rate of deficit volume replacement to run over 48 hours (mL/hour)
    global $settings;
    return volumeToRate(deficitVolumeLessBolus(), $settings->deficitReplacementDuration);
}
function deficitRateFormula(){
    global $settings;
    return "[Deficit volume less bolus] ÷ [".$settings->deficitReplacementDuration." hours]";
}
function deficitRateWorking(){
    global $settings;
    return "[".deficitVolumeLessBolus()."mL] ÷ [".$settings->deficitReplacementDuration." hours] = ".deficitRate()."mL/hour";
}
$calculations->deficit->rate = new StdClass;
$calculations->deficit->rate->val = deficitRate();
$calculations->deficit->rate->formula = deficitRateFormula();
$calculations->deficit->rate->working = deficitRateWorking();

//functions related to calculation of maintenance volume
function maintenanceVolumeUncapped(){ //returns the daily fluid requirement using holliday-segar formula(mL)
    global $data;
    if($data->weight<10) return (($data->weight)*100);
    if($data->weight<20) return ((($data->weight-10)*50)+1000);
    return ((($data->weight-20)*20)+1500);
}
function maintenanceVolumeCapped(){ //returns the maintenance cap
    global $settings;
    return $settings->caps->maintenance;
}
function maintenanceIsCapped(){ //returns true if the uncapped volume exceeds the cap
    if(maintenanceVolumeUncapped() > maintenanceVolumeCapped()) return true;
    return false;
}
function maintenanceVolume(){ //returns the maintenance volume to be used, selecting between capped or uncapped volume
    if(maintenanceIsCapped()) return maintenanceVolumeCapped();
    return maintenanceVolumeUncapped();
}
$calculations->maintenance = new StdClass;
$calculations->maintenance->volume = maintenanceVolume();
$calculations->maintenance->isCapped = maintenanceIsCapped();

//functions related to calculation of maintenance rate
function maintenanceRate(){ //returns the maintenance fluid rate to run over 24 hours (mL/hour)
    return volumeToRate(maintenanceVolume(), 24);
}
$calculations->maintenance->rate = maintenanceRate();

//returns the starting fluid rate
function startingFluidRate(){ 
    global $calculations;
    return $calculations->deficit->rate + $calculations->maintenance->rate;
}
$calculations->startingFluidRate = startingFluidRate();

//functions related to calculation of insulin rates
function insulinRateUncapped(){ //returns the rate literal based on patient weight and selected insulin rate
    global $data;
    return $data->insulinRate*$data->weight;
}
function insulinRateCapped(){ //retuns the capped insulin rate for selected insulin rate option
    global $data;
    global $settings;
    if ($data->insulinRate == 0.05) return $settings->caps->insulin005;
    if ($data->insulinRate == 0.1) return $settings->caps->insulin01; 
    send_error_response("Unable to select insulin rate capped", 400);
}
function insulinIsCapped(){ //returns true if uncapped rate exceeds cap
    if (insulinRateUncapped() > insulinRateCapped()) return true;
    return false;
}
function insulinRate(){ // returns the starting insulin rate (Units/hour), selecting between capped or uncapped rates
    if (insulinIsCapped()) return insulinRateCapped();
    return insulinRateUncapped();
}
$calculations->insulin = new StdClass;
$calculations->insulin->rate = insulinRate();
$calculations->insulin->isCapped = insulinIsCapped();

$calculationsJSON = json_encode($calculations);

?>