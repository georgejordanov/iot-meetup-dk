(function()
{
 "use strict";
 /*
   hook up event handlers 
 */
 function register_event_handlers()
 {
    
    
     /* button  #button-tosettings */
    $(document).on("click", "#button-tosettings", function(evt)
	{
		$("#textbox-settings-api-key").attr("value", app_username);
		$("#textbox-settings-api-token").attr("value", app_password);
		$("#textbox-settings-organization-id").attr("value", org_id);
		$("#textbox-settings-device-type").attr("value", dev_type);
		$("#textbox-settings-device-id").attr("value", dev_id);
	});
    
        /* button  #button-settigns-save */
    $(document).on("click", "#button-settigns-save", function(evt)
    {
        app_username = $("#textbox-settings-api-key").attr("value");
		app_password = $("#textbox-settings-api-token").attr("value");
		org_id = $("#textbox-settings-organization-id").attr("value");
		dev_type = $("#textbox-settings-device-type").attr("value");
		dev_id = $("#textbox-settings-device-id").attr("value");
		
    });
    
    }
 document.addEventListener("app.Ready", register_event_handlers, false);
})();
