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
    send_error_response('Could not determine DKA severity using pH [' . $data->pH . '] and bicarbonate [' . $data->bicarbonate . ']. ' , 400);
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
function bolusIsCapped($mlsPerKg){ //returns true if the uncapped bolus volume exceeds the cap
    if (bolusVolumeUncapped($mlsPerKg) > bolusVolumeCapped()) return true;
    return false;
}
function bolusVolume($mlsPerKg){ //returns the bolus volume to be used, selecting between capped or uncapped volume
    if (bolusIsCapped($mlsPerKg)){
        return bolusVolumeCapped();
    } else {
        return bolusVolumeUncapped($mlsPerKg);
    }
}
$calculations->bolus = new StdClass;
$calculations->bolus->volume = bolusVolume($settings->bolusMlsPerKg);
$calculations->bolus->isCapped = bolusIsCapped($settings->bolusMlsPerKg);

//functions related to calculation of deficit
function deficitPercentage(){ //returns the percentage dehydration based on pH
    global $calculations;
    global $settings;
    if($calculations->severity == "severe") return $settings->severity->severe->deficitPercentage;
    if($calculations->severity == "moderate") return $settings->severity->moderate->deficitPercentage;;
    if($calculations->severity == "mild") return $settings->severity->mild->deficitPercentage;
    send_error_response('Unable to select deficit percentage.' , 400);
}
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
function deficitIsCapped(){ //returns true if the uncapped deficit volume exceeds the cap
    if (deficitVolumeUncapped() > deficitVolumeCapped()) return true;
    return false;
}
function deficitVolume(){ //returns the deficit volume to be used, selecting between capped or uncapped volume
    if (deficitIsCapped()) return deficitVolumeCapped();
    return deficitVolumeUncapped();
}
function deficitBolusToSubtract(){ //returns a bolus volume to subtract, unless patient is shocked in which case boluses are not subtracted
    global $data;
    global $settings;
    if($data->shockPresent) return 0;
    return bolusVolume($settings->bolusMlsPerKg);
}
function deficitVolumeLessBolus(){ //returns the deficit volume with bolus subtracted (if applicable)
    return deficitVolume() - deficitBolusToSubtract();
}
function deficitRate(){ //returns rate of deficit volume replacement to run over 48 hours (mL/hour)
    global $settings;
    return volumeToRate(deficitVolumeLessBolus(), $settings->deficitReplacementDuration);
}
$calculations->deficit = new StdClass;
$calculations->deficit->percentage = deficitPercentage();
$calculations->deficit->volume = deficitVolume();
$calculations->deficit->isCapped = deficitIsCapped();
$calculations->deficit->bolusToSubtract = deficitBolusToSubtract();
$calculations->deficit->volumeLessBolus = deficitVolumeLessBolus();
$calculations->deficit->rate = deficitRate();

//functions related to calculation of maintenance
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
function maintenanceRate(){ //returns the maintenance fluid rate to run over 24 hours (mL/hour)
    return volumeToRate(maintenanceVolume(), 24);
}
$calculations->maintenance = new StdClass;
$calculations->maintenance->volume = maintenanceVolume();
$calculations->maintenance->isCapped = maintenanceIsCapped();
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


?>