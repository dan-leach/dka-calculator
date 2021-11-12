//retrieves inputs from session storage ready for use in submit components

var inputs = {
	name: sessionStorage.getItem("name"), 
	dob: sessionStorage.getItem("dob"), 
	num: sessionStorage.getItem("num"),
	protocolStart: sessionStorage.getItem("protocolStart"),
	sex: sessionStorage.getItem("sex"),
	age: sessionStorage.getItem("age"),
	weight: parseFloat(sessionStorage.getItem("weight")),
	override: sessionStorage.getItem("override"),
	pH: parseFloat(sessionStorage.getItem("pH")),
	shock: sessionStorage.getItem("shock"),
	insulin: sessionStorage.getItem("insulin"),
	preDM: sessionStorage.getItem("preDM"),
	centre: sessionStorage.getItem("centre"),
	auditID: sessionStorage.getItem("auditID"),
	client_DT: sessionStorage.getItem("client_DT"),
};