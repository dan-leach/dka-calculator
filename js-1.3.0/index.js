const disclaimer = { //controls the disclaimer modal that appears on the index page loading
	show: function(){ //shows the modal with the disclaimer text
		bootbox.dialog({
			message: this.text,
			size: 'large',
			backdrop: true,
			closeButton: false,
			buttons: {
				cancel: {
					label: 'Proceed'
				}
			}
		});
	},
	text: "<form><div class='row'><div class='col-sm-12'><strong>Welcome to the DKA Calculator</strong><br><br>Please read and accept the disclaimer below to proceed.<br><br></div></div><div class='row'><div class='col-sm-1'></div><div class='col-sm-10'><div class='panel panel-default'><div class='panel-body'>By using this website and by using the template protocol, and the calculation formulae contained within it, you confirm that you accept the terms of this disclaimer. If you do not agree to such terms, you must not use this site. We are the owner or the licensee of all intellectual property rights in our site.<br><br>Our site is made available free of charge. We do not guarantee that our site, or any content on it, will always be available or be uninterrupted. We may suspend or withdraw or restrict the availability of all or any part of our site for business and operational reasons.<br><br>Although we make reasonable efforts to check this website, the template protocol, and the calculation formulae for accuracy, we make no representations, warranties or guarantees, whether express or implied, that the content on our site is accurate, complete, free from error or up to date, and it remains strictly the treating clinician’s responsibility to check the protocol and calculated values produced by this website manually. The content on our site is provided for general information only. It is not intended to amount to advice on which you should rely.<br><br>The DKA calculator allows a maximum weight for age of +2SDS or 75kg (whichever is lower), and a minimum weight for age of -2SDS. There is the facility to override these weight limits but clinicians do this at their own risk and the BSPED accepts no liability for any adverse events. Neither BSPED nor the ICP or website authors accept any liability for any errors arising from the use of this tool or protocols generated.<br><br>We exclude all implied conditions, warranties, representations or other terms that may apply to our site or any content on it.<br><br>We will not be liable to you for any loss or damage, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, even if foreseeable, arising under or in connection with, use of, or inability to use, our site; or use of or reliance protocol and calculated values produced on our site.<br><br>We do not guarantee that our site will be secure or free from bugs or viruses. You are responsible for configuring your information technology, computer programmes and platform to access our site. You should use your own virus protection software. You must not misuse our site by knowingly introducing viruses, trojans, worms, logic bombs or other material that is malicious or technologically harmful.<br><br>The terms of this disclaimer, its subject matter and its formation (and any non-contractual disputes or claims) are governed by English law. By using this website and the template protocol, and the calculation formulae contained within it, you confirm that you agree to the exclusive jurisdiction of the courts of England and Wales.</div></div></div></div></form>",
}

const regionHospitals = [ //each array is of the hospitals in that region
    index0 = [], //to ensure that region input value correlates with index of appropriate array
    selectRegion = [], //index 1 relates to the placeholder message, if placeholder selected on region input, no centres should be show
    northernIreland = [
        "Altnagelvin Area Hospital, Londonderry",
        "Antrim Area Hospital, Antrim",
        "Causeway Hospital, Coleraine",
        "Craigavon Area Hospital, Craigavon",
        "Daisy Hill Hospital, Newry",
        "Royal Belfast Hospital for Sick Children, Belfast",
        "South West Acute Hospital, Enniskillen",
        "Ulster Hospital, Dundonald"
    ],
    scotland = [
        "Lothian",
		"Greater Glasgow",
		"Wishaw",
		"Borders",
		"Ayrshire & Arran",
		"Dumfries",
		"Highlands",
		"Grampian",
		"Tayside",
		"Fife",
		"Forth Valley"
    ],
    wales = [
        "Bronglais General Hospital",
        "Glan Clwyd Hospital",
        "Glangwili General Hospital",
        "Grange University Hospital",
        "Morriston Hospital",
        "Neath Port Talbot Hospital",
        "Prince Charles Hospital",
        "Princess of Wales Hospital",
        "Royal Glamorgan Hospital",
        "University Hospital of Wales",
        "Withybush General Hospital",
        "Wrexham Maelor Hospital",
        "Ysbyty Gwynedd"
    ],
    eastMidlands = [
        "Boston Pilgrim Hospital",
        "Chesterfield Royal",
        "Derby Hospitals",
        "Grantham and District Hospital",
        "Kettering General Hospital",
        "Leicester Royal Infirmary",
        "Lincoln County Hospital",
        "Northampton General Hospital",
        "Nottingham University Hospitals",
        "Sherwood Forest Hospitals"
    ],
    eastOfEngland = [
        "Addenbrookes Hospital", 
        "Basildon and Thurrock University Hospital", 
        "Bedford Hospital", 
        "Broomfield Hospital",
        "Colchester Hospital", 
        "East & North Herts", 
        "Hinchingbrooke Health Care", 
        "Ipswich Hospital", 
        "James Paget University Hospital", 
        "Luton & Dunstable University Hospital", 
        "Norfolk & Norwich University Hospital", 
        "Peterborough City Hospital", 
        "Princess Alexandra Hospital", 
        "Queen Elizabeth Hospital Kings Lynn", 
        "Queen Elizabeth II Hospital", 
        "Southend University Hospital", 
        "Watford General Hospital",
        "West Suffolk Hospital"
    ],
    northEastAndNorthCumbria = [
        "Bishop Aukland Hospital",
        "Darlington Memorial Hospital",
        "Friarage Hospital",
        "Great North Children's Hospital",
        "North Tyneside General Hospital",
        "Queen Elizabeth Hospital",
        "South Tyneside District Hospital",
        "Sunderland Royal Hospital",
        "The Cumberland Infirmary",
        "The James Cook University Hospital",
        "University Hospital of Hartlepool",
        "University Hospital of North Durham",
        "University Hospital of North Tees",
        "West Cumberland Hospital"
    ],
    northWest = [
        "Alder Hey Children’s",
        "Blackpool Teaching Hospitals",
        "Bolton",
        "Central Manchester University Hospitals",
        "Countess of Chester Hospital",
        "East Cheshire",
        "East Lancashire Hospitals",
        "Lancashire Teaching Hospitals",
        "Mid Cheshire Hospitals",
        "Salford Royal",
        "Southport and Ormskirk Hospital",
        "St Helens and Knowsley Teaching Hospitals",
        "Stockport",
        "Tameside & Glossop Integrated Care",
        "The Pennine Acute Hospitals",
        "University Hospital of South Manchester",
        "University Hospitals of Morecambe Bay",
        "Warrington and Halton Hospitals",
        "Wirral University Teaching Hospital",
        "Wrightington Wigan and Leigh"
    ],
    southEastCoastAndLondonPartnership = [
        "Barnet General Hospital",
        "Buckland Hospital",
        "Central Middlesex",
        "Chelsea and Westminster",
        "Conquest Hospital",
        "Croydon University Hospital",
        "Darent Valley Hospital",
        "Ealing Hospital",
        "East Surrey Hospital",
        "Eastbourne District General Hospital",
        "Epsom Hospital",
        "Evelina London Children’s Hospital",
        "Frimley Park Hospital",
        "Great Ormond Street Hospital for Children",
        "Hillingdon Hospitals",
        "Kent and Canterbury Hospital",
        "King George Hospital",
        "King's College Hospital",
        "Kingston Hospital",
        "Lewisham Hospital",
        "Maidstone Hospital",
        "Medway Maritime Hospital",
        "Newham University Hospital",
        "North Middlesex University Hospital",
        "Northwick Park",
        "Princess Royal University Hospital",
        "Queen Elizabeth Hospital",
        "Queen Elizabeth The Queen Mother Hospital",
        "Queen Mary's Hospital",
        "Queen's Hospital",
        "Royal Alexandra Children's Hospital",
        "Royal Free London",
        "Royal Surrey County Hospital",
        "Royal Victoria Hospital",
        "St George’s Hospital",
        "St Helier Hospital",
        "St. Mary’s Hospital",
        "St. Peter's Hospital",
        "St. Richards Hospital",
        "The Royal London Hospital",
        "The Whittington Hospital",
        "Tunbridge Wells Hospital",
        "University College Hospital",
        "West Middlesex University Hospital",
        "Whipps Cross University Hospital",
        "William Harvey Hospital",
        "Worthing Hospital"
    ],
    southWest = [
        "Gloucestershire Hospitals",
        "Great Western Hospitals",
        "Northern Devon Hospital",
        "Plymouth Hospitals",
        "Royal Cornwall Hospitals",
        "Royal Devon and Exeter Hospitals",
        "Royal United Hospitals Bath",
        "South Devon Healthcare",
        "Taunton and Somerset",
        "University Hospitals Bristol",
        "Yeovil District Hospital"  
    ],
    thamesValley = [
        "Frimley Health",
        "John Radcliffe Hospital",
        "Milton Keynes Hospital",
        "Royal Berkshire",
        "Stoke Mandeville Hospital",
        "Wycombe Hospital"
    ],
    wessex = [
        "Basingstoke and North Hampshire Hospital",
        "Dorset County Hospital",
        "Poole Hospital",
        "Queen Alexandra Hospital",
        "Royal Hampshire County Hospital",
        "Salisbury District Hospital",
        "Southampton General Hospital",
        "St. Mary's Hospital"
    ],
    westMidlands = [
        "Alexandra Hospital",
        "Birmingham Children’s Hospital",
        "Birmingham City Hospital",
        "Burton Hospitals",
        "County Hospital (Stafford)",
        "County Hospital (Wye Valley)",
        "George Eliot Hospital",
        "Good Hope Hospital",
        "Heartlands Hospital",
        "Hospital of St Cross",
        "Kidderminster Hospital",
        "New Cross Hospital",
        "Princess Royal Hospital",
        "Royal Shrewsbury Hospital",
        "Royal Stoke University Hospital",
        "Russells Hall Hospital",
        "Sandwell General Hospital",
        "Solihull Hospital",
        "South Warwickshire",
        "University Hospital Coventry",
        "Walsall Manor Hospital",
        "Worcestershire Royal Hospital"
    ],
    yorkshireAndHumber = [
        "Airedale General Hospital",
        "Barnsley Hospital",
        "Bassetlaw Hospital",
        "Bradford Royal Infirmary",
        "Calderdale Royal Hospital",
        "Dewsbury and District Hospital",
        "Diana, Princess of Wales Hospital",
        "Doncaster Royal Infirmary",
        "Harrogate District Hospital",
        "Huddersfield Royal Infirmary",
        "Hull Royal Infirmary",
        "Leeds Children's Hospital",
        "Pinderfields General Hospital",
        "Pontefract General Infirmary",
        "Rotherham Hospital",
        "Scarborough Hospital",
        "Scunthorpe General Hospital",
        "Sheffield Children's Hospital",
        "St.Luke's Hospital",
        "The York Hospital"
    ],
]

const weightLimits = { //each object contains an array of the lower and upper limit for the safe weight range (+/- 2SD)
	male: {
		lower: [
			2.613, 3.393, 4.178, 4.897, 5.51, 6.019, 6.456, 6.832, 7.159, 7.454, 7.721, 7.963, 8.189, //0-12m (1y)
			8.398, 8.592, 8.774, 8.947, 9.109, 9.266, 9.416, 9.56, 9.703, 9.842, 9.979, 10.116, //13-24m (2y)
			10.254, 10.389, 10.528, 10.668, 10.808, 10.951, 11.095, 11.236, 11.38, 11.521, 11.66, 11.798, //25-36m (3y)
			11.932, 12.062, 12.19, 12.315, 12.435, 12.554, 12.672, 12.787, 12.903, 13.019, 13.135, 13.254, //37-48m (4y)
			13.376, 13.499, 13.626, 13.756, 13.886, 14.021, 14.158, 14.294, 14.433, 14.572, 14.711, 14.85, //49-60m (5y)
			14.988, 15.123, 15.257, 15.391, 15.523, 15.654, 15.786, 15.916, 16.047, 16.18, 16.31, 16.443, //61-72m (6y)
			16.576, 16.707, 16.841, 16.975, 17.108, 17.244, 17.381, 17.518, 17.657, 17.798, 17.939, 18.082, //73-84m (7y)
			18.228, 18.372, 18.52, 18.668, 18.814, 18.962, 19.111, 19.26, 19.409, 19.561, 19.711, 19.864, //85-96m (8y)
			20.018, 20.171, 20.326, 20.481, 20.636, 20.792, 20.949, 21.103, 21.26, 21.416, 21.572, 21.729, //97-108m (9y)
			21.888, 22.046, 22.207, 22.368, 22.528, 22.692, 22.856, 23.021, 23.19, 23.361, 23.532, 23.708, //109-120m (10y)
			23.884, 24.06, 24.24, 24.418, 24.594, 24.771, 24.946, 25.118, 25.292, 25.464, 25.633, 25.805, //121-132m (11y)
			25.974, 26.143, 26.314, 26.486, 26.658, 26.835, 27.016, 27.197, 27.386, 27.58, 27.776, 27.981, //133-144m (12y)
			28.192, 28.409, 28.633, 28.865, 29.099, 29.344, 29.593, 29.846, 30.108, 30.376, 30.647, 30.928, //145-156m (13y)
			31.214, 31.506, 31.808, 32.116, 32.426, 32.744, 33.069, 33.395, 33.73, 34.068, 34.408, 34.756, //157-168m (14y)
			35.109, 35.461, 35.825, 36.193, 36.561, 36.939, 37.325, 37.708, 38.106, 38.505, 38.91, 39.32, //169-180m (15y)
			39.738, 40.153, 40.577, 41.007, 41.433, 41.869, 42.306, 42.738, 43.176, 43.614, 44.043, 44.471, //181-192m (16y)
			44.895, 45.306, 45.712, 46.11, 46.494, 46.869, 47.235, 47.583, 47.925, 48.254, 48.57, 48.878, //193-204m (17y)
			49.176, 49.459, 49.733, 50, 50.25, 50.497, 50.733, 50.957, 51.173, 51.382, 51.581, 51.773, //205-216m (18y)
			51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773, 51.773 //217-229m (19y) --> Child data only up to 18yrs so for 217-229m justs uses same value as for 216th month		
		],
		upper: [
			4.556, 5.699, 6.817, 7.811, 8.644, 9.334, 9.93, 10.452, 10.914, 11.341, 11.736, 12.1, 12.445, //0-12m (1y)
			12.771, 13.074, 13.365, 13.643, 13.906, 14.162, 14.41, 14.65, 14.888, 15.123, 15.354, 15.587, //13-24m (2y)
			15.822, 16.056, 16.295, 16.537, 16.78, 17.028, 17.28, 17.527, 17.78, 18.03, 18.274, 18.518, //25-36m (3y)
			18.757, 18.989, 19.218, 19.441, 19.657, 19.874, 20.086, 20.296, 20.509, 20.72, 20.934, 21.154, //37-48m (4y)
			21.378, 21.607, 21.843, 22.086, 22.331, 22.586, 22.844, 23.103, 23.37, 23.639, 23.907, 24.178, //49-60m (5y)
			24.45, 24.718, 24.988, 25.258, 25.525, 25.797, 26.071, 26.343, 26.622, 26.906, 27.189, 27.48, //61-72m (6y)
			27.776, 28.069, 28.372, 28.679, 28.986, 29.304, 29.627, 29.954, 30.292, 30.637, 30.986, 31.345, //73-84m (7y)
			31.714, 32.085, 32.468, 32.855, 33.243, 33.641, 34.045, 34.45, 34.864, 35.282, 35.702, 36.133, //85-96m (8y)
			36.566, 36.998, 37.439, 37.881, 38.325, 38.773, 39.222, 39.67, 40.124, 40.575, 41.026, 41.482, //97-108m (9y)
			41.937, 42.389, 42.85, 43.309, 43.762, 44.22, 44.68, 45.133, 45.597, 46.065, 46.524, 46.999, //109-120m (10y)
			47.47, 47.941, 48.418, 48.894, 49.362, 49.834, 50.302, 50.758, 51.222, 51.685, 52.132, 52.593, //121-132m (11y)
			53.044, 53.489, 53.942, 54.392, 54.832, 55.287, 55.743, 56.194, 56.66, 57.131, 57.603, 58.084, //133-144m (12y)
			58.577, 59.078, 59.588, 60.112, 60.639, 61.186, 61.746, 62.312, 62.903, 63.501, 64.112, 64.742, //145-156m (13y)
			65.38, 66.028, 66.7, 67.372, 68.047, 68.737, 69.433, 70.126, 70.831, 71.533, 72.234, 72.94, //157-168m (14y)
			73.644, 74.331, 75.025, 75.708, 76.37, 77.033, 77.684, 78.303, 78.923, 79.517, 80.096, 80.656, //169-180m (15y)
			81.201, 81.717, 82.217, 82.7, 83.15, 83.59, 83.998, 84.384, 84.754, 85.103, 85.424, 85.728, //181-192m (16y)
			86.015, 86.281, 86.528, 86.766, 86.992, 87.203, 87.412, 87.608, 87.802, 87.993, 88.174, 88.358, //193-204 (17y)
			88.539, 88.709, 88.884, 89.056, 89.218, 89.388, 89.55, 89.71, 89.866, 90.023, 90.174, 90.325, //205-216m (18y)
			90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325, 90.325 //217-229m (19y) --> Child data only up to 18yrs so for 217-229m justs uses same value as for 216th month
		],
	},
	female: {
		lower: [
			2.531, 3.236, 3.939, 4.594, 5.162, 5.64, 6.052, 6.407, 6.716, 6.995, 7.25, 7.482, 7.702, //0-12m (1y)
			7.908, 8.1, 8.285, 8.46, 8.626, 8.788, 8.945, 9.097, 9.249, 9.398, 9.542, 9.686, //13-24m (2y)
			9.829, 9.969, 10.11, 10.252, 10.391, 10.532, 10.672, 10.809, 10.946, 11.081, 11.213, 11.344, //25-36m (3y)
			11.474, 11.6, 11.726, 11.85, 11.972, 12.096, 12.217, 12.337, 12.458, 12.578, 12.697, 12.817, //37-48m (4y)
			12.937, 13.057, 13.177, 13.299, 13.42, 13.544, 13.668, 13.791, 13.916, 14.042, 14.165, 14.29, //49-60m (5y)
			14.415, 14.538, 14.661, 14.786, 14.908, 15.033, 15.158, 15.282, 15.409, 15.536, 15.663, 15.793, //61-72m (6y)
			15.923, 16.054, 16.187, 16.32, 16.454, 16.592, 16.732, 16.873, 17.017, 17.165, 17.314, 17.467, //73-84m (7y)
			17.623, 17.778, 17.936, 18.096, 18.254, 18.414, 18.574, 18.733, 18.895, 19.055, 19.214, 19.375, //85-96m (8y)
			19.534, 19.692, 19.851, 20.009, 20.165, 20.323, 20.481, 20.639, 20.799, 20.961, 21.124, 21.292, //97-108m (9y)
			21.462, 21.633, 21.808, 21.985, 22.161, 22.34, 22.519, 22.699, 22.879, 23.06, 23.239, 23.418, //109-120m (10y)
			23.597, 23.773, 23.953, 24.131, 24.308, 24.487, 24.668, 24.848, 25.033, 25.219, 25.405, 25.598, //121-132m (11y)
			25.795, 25.994, 26.203, 26.418, 26.635, 26.866, 27.104, 27.347, 27.603, 27.867, 28.139, 28.422, //133-144m (12y)
			28.716, 29.016, 29.329, 29.651, 29.979, 30.32, 30.667, 31.015, 31.376, 31.739, 32.103, 32.472, //145-156m (13y)
			32.846, 33.213, 33.585, 33.952, 34.313, 34.675, 35.037, 35.386, 35.738, 36.087, 36.424, 36.764, //157-168m (14y)
			37.092, 37.417, 37.734, 38.042, 38.341, 38.632, 38.916, 39.188, 39.452, 39.707, 39.949, 40.183, //169-180m (15y)
			40.408, 40.624, 40.831, 41.032, 41.221, 41.405, 41.582, 41.747, 41.909, 42.063, 42.21, 42.351, //181-192m (16y)
			42.487, 42.614, 42.736, 42.854, 42.964, 43.069, 43.169, 43.263, 43.353, 43.439, 43.519, 43.595, //193-204m (17y)
			43.668, 43.736, 43.801, 43.863, 43.921, 43.976, 44.029, 44.078, 44.124, 44.17, 44.211, 44.25, //205-216m (18y)
			44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25, 44.25 //217-229m (19y) --> Child data only up to 18yrs so for 217-229m justs uses same value as for 216th month
		],
		upper: [
			4.359, 5.343, 6.309, 7.199, 7.971, 8.628, 9.201, 9.707, 10.156, 10.571, 10.957, 11.315, 11.659, //0-12m (1y)
			11.988, 12.298, 12.598, 12.888, 13.165, 13.438, 13.706, 13.967, 14.228, 14.488, 14.742, 14.997, //13-24m (2y)
			15.253, 15.504, 15.761, 16.02, 16.276, 16.537, 16.799, 17.057, 17.317, 17.577, 17.832, 18.089, //25-36m (3y)
			18.345, 18.596, 18.85, 19.102, 19.351, 19.606, 19.858, 20.11, 20.367, 20.624, 20.88, 21.14, //37-48m (4y)
			21.402, 21.665, 21.932, 22.204, 22.476, 22.756, 23.038, 23.321, 23.609, 23.899, 24.189, 24.481, //49-60m (5y)
			24.776, 25.068, 25.363, 25.661, 25.956, 26.258, 26.561, 26.862, 27.172, 27.486, 27.8, 28.12, //61-72m (6y)
			28.446, 28.773, 29.109, 29.451, 29.794, 30.15, 30.512, 30.882, 31.264, 31.656, 32.053, 32.467, //73-84m (7y)
			32.889, 33.311, 33.742, 34.179, 34.615, 35.058, 35.5, 35.939, 36.387, 36.832, 37.274, 37.72, //85-96m (8y)
			38.165, 38.608, 39.049, 39.495, 39.936, 40.382, 40.834, 41.282, 41.741, 42.204, 42.668, 43.147, //97-108m (9y)
			43.629, 44.111, 44.608, 45.107, 45.604, 46.112, 46.617, 47.126, 47.641, 48.158, 48.674, 49.196, //109-120m (10y)
			49.721, 50.238, 50.766, 51.292, 51.812, 52.331, 52.851, 53.365, 53.879, 54.389, 54.885, 55.386, //121-132m (11y)
			55.881, 56.362, 56.841, 57.309, 57.761, 58.213, 58.654, 59.076, 59.501, 59.913, 60.322, 60.722, //133-144m (12y)
			61.126, 61.52, 61.925, 62.325, 62.724, 63.129, 63.539, 63.939, 64.352, 64.762, 65.173, 65.588, //145-156m (13y)
			66.007, 66.419, 66.837, 67.248, 67.648, 68.045, 68.434, 68.802, 69.169, 69.525, 69.86, 70.195, //157-168m (14y)
			70.512, 70.824, 71.124, 71.412, 71.693, 71.964, 72.229, 72.479, 72.728, 72.97, 73.195, 73.423, //169-180m (15y)
			73.642, 73.856, 74.067, 74.277, 74.478, 74.681, 74.877, 75.068, 75.258, 75.44, 75.617, 75.791, //181-192m (16y)
			75.962, 76.122, 76.28, 76.431, 76.576, 76.716, 76.85, 76.976, 77.103, 77.224, 77.333, 77.442, //193-204m (17y)
			77.548, 77.646, 77.738, 77.829, 77.913, 77.993, 78.072, 78.144, 78.211, 78.281, 78.34, 78.4, //205-216m (18y)			
			78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4, 78.4 //217-229m (19y) --> Child data only up to 18yrs so for 217-229m justs uses same value as for 216th month
		],
	},
}

const indexForm = { //all the functions relating to the checking, styling and submitting of the patient data form on the index page
	clear: function(){ //empties the form ready for fresh input
		try{
			this.inputs.name.set("");
			this.inputs.dob.set("");
			this.inputs.num.set("");
			this.inputs.protocolStart.set("");
			this.inputs.sex.set("1");
			this.inputs.weight.set("");
			this.inputs.weight.hideOverride();
			this.inputs.pH.set("");
			this.inputs.shock.set("1");
			this.inputs.insulin.set("1");
			this.inputs.preDM.set("1");
			this.inputs.region.set("1");
			this.inputs.episode.set("1");
			console.log('Form cleared');
		} catch (e) {
			errHandler(e);
		}
	},
	joeBloggs: function(){ //only used during development, populates the form with values show below
		try{
			const joeBloggs = [ //the values to set when using Joe Bloggs button
				"Joe Bloggs",
				"12/03/2010",
				"1234567",
				moment().format('DD/MM/YYYY HH:mm'),
				"3",
				"200",
				"7.12",
				"2",
				"2",
				"2",
				"9",
				"King's College Hospital",
				"4",
			];
			var x = 0;
			for (input in indexForm.inputs){ //loops through all the inputs and sets them according to const Joe Bloggs
				if (input == "age") continue;//skip age as set by dob.blur()
				indexForm.inputs[input].set(joeBloggs[x]);
				indexForm.inputs[input].blur();
				x++;
			}
			if (!this.inputs.weight.pass()) { //if Joe Bloggs' weight is not within safety range then check override checkbox and re-check to pass
				$('#overrideCheckbox').prop( "checked", true );
				indexForm.inputs.weight.blur();
			}
		} catch (e) {
			errHandler(e);
		}
	},
	inputs: { //contains all the setting, checking functions for all the inputs
		name: { //the functions for the name input
			name: "name",
			set: function(val){ //set input name to val
				document.getElementById(this.name).value = val;
			},
			value: function(){ //returns current value of input name
				return document.getElementById(this.name).value;
			},
			store: function(){ //stores the current value of input name in local session storage
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){ //on input name losing focus update styling according to pass
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){ //returns true if all requirements are met
				if (this.goodChars() && this.goodLength()) return true;
				return false;
			},
			goodChars: function(){ //returns true if only alphabetic characters, hypens, apostrophes or spaces in name
				var chars = /^[a-zA-Z-' ]+$/;
				if (this.value().match(chars)) return true;
				return false;
			},
			goodLength: function(){ // returns true if name is at least 4 characters long
				if (this.value().length > 4) return true;
				return false;
			},
			failMsg: function(){ //returns the advisory message if set value is not valid
				if (!this.goodLength()) return "Enter full name (minimum 5 characters).";
				if (!this.goodChars()) return "Only characters A-Z, hyphen and apostrophe permitted.";
				throw "Unable to select failMsg";
			}
		},
		dob: { 
			name: "dob",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
						indexForm.inputs.age.set(moment().diff(moment(this.value(), "DD/MM/YYYY"), 'years'));
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.inputs.age.set("");
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.inputs.age.blur();
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.goodFormat() && this.beforeToday()) return true;
				return false;
			},
			goodFormat: function(){
				if (moment(this.value(), 'DD/MM/YYYY', true).isValid()) return true;
				return false;
			},
			beforeToday: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY"), 'days') > 0) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodFormat()) return "Date must be in the format DD/MM/YYYY.";
				if (!this.beforeToday()) return "Date of birth must be before today";
				throw "Unable to select failMsg";
			}
		},
		num: {
			name: "num",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.goodLength()) return true;
				return false;
			},
			goodLength: function(){
				if (this.value().length > 4) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodLength()) return "Enter full hospital/NHS number (minimum 5 characters).";
				throw "Unable to select failMsg";
			}
		},
		protocolStart: {
			name: "protocolStart",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.goodFormat() && this.notFuture() && this.isRecent()) return true;
				return false;
			},
			goodFormat: function(){
				if (moment(this.value(), 'DD/MM/YYYY HH:mm', true).isValid()) return true;
				return false;
			},
			notFuture: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY HH:mm"), 'hours') >= 0) return true;
				return false;
			},
			isRecent: function(){
				if (moment().diff(moment(this.value(), "DD/MM/YYYY HH:mm"), 'days') < 32) return true;
				return false;
			},
			failMsg: function(){
				if (!this.goodFormat()) return "Protocol start date/time must be in the format DD/MM/YYYY HH:MM.";
				if (!this.notFuture()) return "Protocol start date/time cannot be in the future.";
				if (!this.isRecent()) return "Protocol start date/time must be within the last month.";
				throw "Unable to select failMsg";
			}
		},
		sex: {
			name: "sex",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isMale()) {
					sessionStorage.setItem(this.name, "Male");
					return;
				} else if (this.isFemale()) {
					sessionStorage.setItem(this.name, "Female");
					return;
				}
				throw "unable to store sex";
			},
			isMale: function(){
				if (this.value() == "3") return true;
				return false;
			},
			isFemale: function(){
				if (this.value() == "2") return true;
				return false;
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
					if (indexForm.inputs.weight.value() !== "") indexForm.inputs.weight.blur(); //recheck weight if sex changes (but not if weight isn't yet set)
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		age: {
			name: "age",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
					if (indexForm.inputs.weight.value() !== "") indexForm.inputs.weight.blur(); //recheck weight if age changes (but not if weight isn't yet set)
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.setValid() && this.inRange()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value())) return true;
				return false;
			},
			inRange: function(){
				if (this.value() < 19 && this.value() >= 0) return true;
				return false;
			},
			failMsg: function(){
				if (!this.setValid()) return "Enter valid date of birth and age will be calculated automatically.";
				if (!this.inRange()) return "Age must be between 0 and 18 years.";
				throw "Unable to select failMsg";
			}
		},
		weight: {
			name: "weight",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){ //also stores the value of the override checkbox
				sessionStorage.setItem(this.name, this.value())
				if (this.isOverridden()) {
					sessionStorage.setItem("override", "Yes");
				} else {
					sessionStorage.setItem("override", "No");
				}
			},
			blur: function(){ //determines if override checkbox should be shown or hidden in addition to styling
				try{
					if (this.canCheck() && this.setValid){
						if (this.inRange()){
							indexForm.style.setPass(this.name);
							this.hideOverride();
							indexForm.style.progressBar();
							return;
						} else if (this.isOverridden()) {
							indexForm.style.setPass(this.name);
							indexForm.style.progressBar();
							return;
						} else {
							this.showOverride();
							indexForm.style.progressBar();
						}
					}
					indexForm.style.setNeutral(this.name);
					indexForm.style.setMsg(this.name, this.failMsg());
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if ((this.canCheck() && this.setValid()) && (this.isOverridden() || this.inRange())) return true;
				return false;
			},
			isOverridden: function(){
				return document.getElementById("overrideCheckbox").checked; 
			},
			canCheck: function(){ //cannot check weight until sex and age is set
				if (indexForm.inputs.sex.pass() && indexForm.inputs.age.pass()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value())) return true;
				return false;
			},
			limits: function(){ //gets the limits from the weightLimits const based on age in months
				var ageMonths = moment().diff(moment(indexForm.inputs.dob.value(), "DD/MM/YYYY"), 'months');
				if (indexForm.inputs.sex.isMale()) var limits = {lower: weightLimits.male.lower[ageMonths], upper: weightLimits.male.upper[ageMonths]};
				if (indexForm.inputs.sex.isFemale()) var limits = {lower: weightLimits.female.lower[ageMonths], upper: weightLimits.female.upper[ageMonths]};
				if (limits.upper>settings.caps.weight) limits.upper = settings.caps.weight;
				return limits;
			},
			inRange: function(){
				if (this.value() > this.limits().lower && this.value() < this.limits().upper) return true;
				return false;
			},
			failMsg: function(){
				if (!this.canCheck()) return "Cannot check weight against acceptable range until patient's age and sex is set.";
				if (!this.setValid()) return "Weight may only contain digits (0-9) and decimal(.).";
				if (!this.inRange()) return "Weight must be within 2 standard deviations of the mean for age (upper limit " + settings.caps.weight + "kg) ("+this.limits().lower+"kg to "+this.limits().upper+"kg).";
				throw "Unable to select failMsg";
			},
			showOverride: function(){
				document.getElementById("override").style.display = "block";
			},
			hideOverride: function(){
				document.getElementById("overrideCheckbox").checked = false;
				document.getElementById("override").style.display = "none";
			},
		},
		pH: {
			name: "pH",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem(this.name, this.value());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.setValid() && this.inRange()) return true;
				return false;
			},
			setValid: function(){
				if ($.isNumeric(this.value())) return true;
				return false;
			},
			inRange: function(){
				if (this.value() <= settings.severity.mild.range.upper && this.value() >= settings.severity.severe.range.lower) return true;
				return false;
			},
			failMsg: function(){
				if (!this.setValid()) return "pH must contain only digits (0-9) and decimal(.).";
				if (!this.inRange()) return "pH must be in the range " + settings.severity.severe.range.lower + " to " + settings.severity.mild.range.upper + ".";
				throw "Unable to select failMsg";
			}
		},
		shock: {
			name: "shock",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isShocked()) {
					sessionStorage.setItem(this.name, "Yes");
				} else {
					sessionStorage.setItem(this.name, "No");
				}
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			isShocked: function(){
				if (this.value()=="3") return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		insulin: {
			name: "insulin",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.standardRate()) {
					sessionStorage.setItem(this.name, "0.05");
				} else {
					sessionStorage.setItem(this.name, "0.1");
				}
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			standardRate: function(){
				if (this.value() == "2") return true;
				return false;
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		preDM: {
			name: "preDM",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				if (this.isDiabetic()) {
					sessionStorage.setItem(this.name, "Yes");
				} else {
					sessionStorage.setItem(this.name, "No");
				}
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			isDiabetic: function(){
				if (this.value() == "3") return true;
				return false;
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		region: {
			name: "region",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("region", $("#region option:selected").html());
			},
			blur: function(){ //also calls the function to populate the centre drop down input, passing the appropriate array of regions
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
						indexForm.inputs.centre.populate(regionHospitals[this.value()]);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
						indexForm.inputs.centre.reset();
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		centre: {
			name: "centre",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			populate: function(centreList){ //receives an array containing the hospitals of the selected region from the checkregion function and populates the centre menu with these
				document.getElementById("centre").length = 0; //removes centres already in list if region changed
				document.getElementById("centre").options[0]=new Option("Select your centre from list:","");
				var menuOption;
				for(var i = 0; i < centreList.length; i++) { //iterates over centreList and adds each item to the centre drop down menu
					menuOption = document.createElement("option");
					menuOption.text = centreList[i];
					menuOption.value = centreList[i];
					document.getElementById("centre").add(menuOption);
				}
			},
			reset: function(){
				document.getElementById("centre").length = 0; //removes centres already in list if region changed
				document.getElementById("centre").options[0]=new Option("Select region first.","0");
				indexForm.style.setNeutral(this.name);
				indexForm.style.setMsg(this.name, "");
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("centre", $("#centre option:selected").html());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() == "0" || this.value() == "")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
		episode: {
			name: "episode",
			set: function(val){
				document.getElementById(this.name).value = val;
			},
			value: function(){
				return document.getElementById(this.name).value;
			},
			store: function(){
				sessionStorage.setItem("episode", $("#episode option:selected").html());
			},
			blur: function(){
				try{
					if (this.pass()) {
						indexForm.style.setPass(this.name);
					} else {
						indexForm.style.setNeutral(this.name);
						indexForm.style.setMsg(this.name, this.failMsg());
					}
					indexForm.style.progressBar();
				} catch (e) {
					errHandler(e);
				}
			},
			pass: function(){
				if (this.notBlank()) return true;
				return false;
			},
			notBlank: function(){
				if (!(this.value() === "1")) return true;
				return false;
			},
			failMsg: function(){
				if (!this.notBlank()) return "Select an option from the drop-down menu.";
				throw "Unable to select failMsg";
			}
		},
	},
	style: {
		setPass: function(input){ //sets the input to be green with tick icon
			this.setMsg(input, "");
			$("#div_"+input).addClass("has-success").removeClass("has-error");
			$("#div_"+input+"_glyph").html("<span class='glyphicon glyphicon-ok form-control-feedback'></span>");
		},
		setNeutral: function(input){ //sets the input to be neither green nor red with no icon
			$("#div_"+input).removeClass("has-success");
			$("#div_"+input).removeClass("has-error");
			$("#div_"+input+"_glyph").html("<span class='glyphicon form-control-feedback'></span>");
		},
		setFail: function(input){ //sets the input to be red with cross icon
			$("#div_"+input).addClass("has-error").removeClass("has-success");
			$("#div_"+input+"_glyph").html("<span class='glyphicon glyphicon-remove form-control-feedback'></span>");
		},
		setMsg: function(input, msg){ //sets the input to have an advisory message
			$("#div_"+input+"_info").text(msg);
		},
		progressBar: function(){ //updates the progress bar based on the number of inputs that pass
			var passCount = 0;
			for (input in indexForm.inputs){ //count the inputs that pass
				if (indexForm.inputs[input].pass()) {
					passCount++;
				}
			}
		    //update progress bar appearance (and remove warning banner if applicable)
			$("#progBar").css("width", ((passCount/14)*100)+"%").attr("aria-valuenow", 50);
			if(passCount===14){ //set progress bar green and remove in progress animation and warning banner if all pass
				$("#progBar").addClass("progress-bar-success").removeClass("active progress-bar-striped");
				$("#warn").html("");
			} else { //set progress bar in progress animation
				$("#progBar").addClass("active progress-bar-striped").removeClass("progress-bar-success");
			}
		},
	},
	submit: {
	    click: function(){ //user clicks submit
			try{
			    if (indexForm.inputs.name.value() === "throw test error") this.throwTestError() //if I enter this value into the name field, on submit an error will occur - used to test error handling
				if (!this.check()) return false; //if not all inputs pass then do not proceed
				if (indexForm.inputs.weight.isOverridden()) { // if weight safety limit overriden, require confirmation
					this.confirmOverride();
				} else {
					this.send(); //submit the form
				}
			} catch (e) {
				errHandler(e);
			}
	    },
	    throwTestError: function(){ //used to test error handling
	        console.error("Throwing test error")
	        intentionally_throwing_a_test_error() //undefined function will throw an error
	    },
	    check: function(){
			var failCount = 0;
			for (input in indexForm.inputs){
				if (!indexForm.inputs[input].pass()) { //if an input does not pass, increment the failCount and update the styling and show advisory message for the input
					failCount++;
					console.log(indexForm.inputs[input].name + " fails submitCheck");
					indexForm.style.setFail(indexForm.inputs[input].name);
					indexForm.style.setMsg(indexForm.inputs[input].name, indexForm.inputs[input].failMsg());
				}
			}
			if (failCount == 0){
				console.log("submitCheck passes");
				return true;
			}
			$("#warn").html("<div class='alert alert-warning alert-dismissible'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a><strong>Warning!</strong> Correct the errors above before proceeding.</div>"); //show warning banner if not all inputs pass on attempted submission
			return false;
		},
	    confirmOverride: function(){
    	    bootbox.confirm({
    			message: '<div class="panel panel-danger"><div class="panel-heading" style="font-size:24px;">You are overriding the weight safety range</div><div class="panel-body">You should only continue if you are sure ' + indexForm.inputs.weight.value() + 'kg is the correct weight and you have considererd using a maximum weight of the 98th centile weight for age as per the care pathway.<br><br>You can proceed with a weight that is outside the expected range, however the calculator has upper limits that cannot be overriden. These are based on a maximum weight of ' + settings.caps.weight + 'kg as per the BSPED Guidelines. Any calculated values that exceed this will be capped as follows:<div class="well"><ul><li>Daily maintenance volume is capped at ' + settings.caps.maintenance + 'mL (Holliday-Segar formula for ' + settings.caps.weight + 'kg)</li><li>Deficit volume is capped at ' + settings.caps.deficit10 + 'mL for patients with severe DKA (10% dehydration for ' + settings.caps.weight + 'kg)</li><li>Deficit volume is capped at ' + settings.caps.deficit5 + 'mL for patients with mild or moderate DKA (5% dehydration for ' + settings.caps.weight + 'kg)</li><li>Bolus volumes are capped at ' + settings.caps.bolus + 'mL (10mL/kg for ' + settings.caps.weight + 'kg)</li><li>Insulin rate is capped at ' + settings.caps.insulin01 + ' Units/hour if insulin rate of 0.1 Units/kg/hour is selected (0.1 Units/kg/hour for ' + settings.caps.weight + 'kg patient)</li><li>Insulin rate is capped at ' + settings.caps.insulin005 + ' Units/hour if insulin rate of 0.05 Units/kg/hour is selected (0.05 Units/kg/hour for ' + settings.caps.weight + 'kg patient)</li></ul></div><strong>Calculations will be based on ' + indexForm.inputs.weight.value() + 'kg and only capped if they exceed the values above.</strong><br>Bear in mind that these caps could still allow significantly excessive values especially if your patient is much smaller than ' + settings.caps.weight + 'kg.</div></div>',
    			buttons: {
    				cancel: {
    					label: '<i class="fa fa-times"></i> Go back and review'
    				},
    				confirm: {
    					label: '<i class="fa fa-check"></i> Proceed with weight of ' + indexForm.inputs.weight.value() + 'kg',
    					className: 'btn-danger'
    				}
    			},
				closeButton: false,
    			backdrop: true,
    			size: "large",
    			callback: function (result) { //if confirm button pressed
    				if (result===true){
						try{
    						indexForm.submit.send(); //submit the form
						} catch (e) {
							errHandler(e);
						}
    				}
    			}
    		});
    	},
    	store: function(){ //adds all the required data to session storage to be retrieved by submit page (does not just post all to server as some data is patient identifiable)
			for (input in indexForm.inputs){
				indexForm.inputs[input].store();
			}
        	sessionStorage.setItem("auditID", document.getElementById('auditID').value); //auditID is not included in indexForm.inputs
			sessionStorage.setItem("client_DT", moment().format('DD/MM/YYYY HH:mm')); //use this format for sessionStorage (preferred format for printing on protocol));
    	},
		preSendSet: function(){ //sets inputs to correct formats for POST and populates hidden inputs
        	document.getElementById('protocolStart').value = moment(indexForm.inputs.protocolStart.value(), 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'); //sets the POST format of protocolStart to be compatible with SQL database
        	document.getElementById('client_DT').value = moment().format('YYYY-MM-DD HH:mm:ss') //sets the client datetime hidden input for posting - use this format for POST (compatible with SQL)
	        document.getElementById('client_uA').value = window.navigator.userAgent; //sets the client userAgent hidden input for posting
    	},
    	send: function(){ //submit the form
			this.store();
			this.preSendSet();
    		$("#protocolForm").submit(); //triggers the POST
    	},
	},
}

$(document).ready(function(){ //runs once page loaded
	try{
		indexForm.clear(); //empty the form
		add_auditID(); //set the auditID field
		indexForm.style.setPass("auditID"); //style the auditID field as passed
		disclaimer.show(); //show the disclaimer modal
	} catch (e) {
		errHandler(e);
	}
});