const settings = {
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
        weight: 75, //upper weight limit for calculations (kg)
        maintenance: 2600, //maximum allowed daily maintenance volume (mL)
        deficit10: 7500, //maximum allowed total deficit volume for 10% deficit (mL)
        deficit5: 3750, //maximum allowed total deficit volume for 5% deficit (mL)
        bolus: 750, //maximum allowed bolus volume (mL)
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
}