/* ibasov 01062022 chrome extension can not use SiebelApp properties
   and we render hidden DOM elements, which store results of using SiebelApp properties.
   Hide element by using class "jjj-inspect-hide" from jjj_inspect.css, that is injected via content.js
*/

if("GetBusObj" in SiebelApp.S_App){
	
	// Render element with active WS name
	var curWsInput = document.createElement('input');
	curWsInput.setAttribute('id', 'jjj-inspect-ws');
	curWsInput.setAttribute('class','jjj-inspect-hide');
	curWsInput.onclick = function() {
		const service = SiebelApp.S_App.GetService("Web Engine Client Preferences")
		let ps = SiebelApp.S_App.NewPropertySet();
		let config = {
					async: false,
					cb: function (methodName, inputSet, outputSet) {
							let el = document.getElementById('jjj-inspect-ws');
							el.value = outputSet.GetChildByType('ResultSet').GetProperty('WSName');
						}
		};
		service.InvokeMethod("GetActiveWSContext", ps, config);
	}
	document.body.appendChild(curWsInput);

	//Render Inspect button
	var inspectBtn = document.createElement('button');
	inspectBtn.setAttribute('type', 'image');
	inspectBtn.setAttribute('id', 'jjj-inspect-btn');
	inspectBtn.setAttribute('class','jjj-inspect-hide');
	inspectBtn.onclick=function() {
		
		const service = SiebelApp.S_App.GetService("Workflow Process Manager");
		let ps = SiebelApp.S_App.NewPropertySet();
		ps.SetProperty("ProcessName", "JJJ Developer Support - Inspect");
		let el = document.getElementById('jjj-inspect-ws');
		ps.SetProperty("sName", el.value);
		let config = {
					  async: false,
					  cb: function (methodName, inputSet, outputSet) {
							let sRes;
							if (outputSet.GetProperty("Status") == "Error") {
									sRes = outputSet.GetChildByType("Errors").GetChild(0).GetProperty("ErrMsg");
							}
							alert(sRes || "WS открыт!");
						}
					};
		service.InvokeMethod("RunProcess", ps, config);
	};		
	document.body.appendChild(inspectBtn);
	
	//Render list of Dev WS
	var wsSelect = document.createElement('select');
	wsSelect.setAttribute('id', 'jjj-inspect-ws-select');
	wsSelect.setAttribute('class','jjj-inspect-hide');
	wsSelect.onclick = function() {
		const service = SiebelApp.S_App.GetService("Workflow Process Manager");
		let ps = SiebelApp.S_App.NewPropertySet();
		ps.SetProperty("ProcessName", "JJJ Developer Support - Query WS List");
		let config = {
					async: false,
					cb: function (methodName, inputSet, outputSet) {
							let el = document.getElementById('jjj-inspect-ws-select');
							let result = outputSet.GetChildByType("ResultSet");
							if (!result) return;
							
							let wsList = result.GetChildByType("hSM").GetChildByType("ListOfJJJ Workspace").GetChildByType("Repository Repository").GetChildByType("ListOfRepository Workspace");
							if(!wsList) return;
							
							let curOptions = document.getElementsByClassName('jjj-inspect-ws-option');
							while(curOptions.length)
								curOptions[0].remove();
								
							
							for (let i=0; i < wsList.GetChildCount(); i++){
								
								let wsOption = document.createElement('option');
								let wsName = wsList.GetChild(i).GetProperty('Name');
								wsOption.setAttribute('id', wsName);
								wsOption.setAttribute('value', wsName);
								wsOption.setAttribute('class', 'jjj-inspect-ws-option');
								
								el.appendChild(wsOption);
								
							}
								
							
						}
		};
		service.InvokeMethod("RunProcess", ps, config);
	}
	document.body.appendChild(wsSelect);

}

		