/*
 * Copyright © 2012-2015, Intel Corporation. All rights reserved.
 * Please see the included README.md file for license terms and conditions.
 */


/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false app:false, dev:false, cordova:false */



// This file contains your event handlers, the center of your application.
// NOTE: see app.initEvents() in init-app.js for event handler initialization code.

// function myEventHandler() {
//     "use strict" ;
// // ...event handler code here...
// }


var colors=[0,0,0];

var org_id = "7lmfb9";
var dev_type = "led-device";
var dev_id = "rgb-led-meetup4";

var app_host = org_id+".messaging.internetofthings.ibmcloud.com";
var app_username = "a-7lmfb9-s2adazemsd";
var app_password = "UVsxwoZfBogJU6h9WN";
var app_clientID = "a:"+org_id+":meetup-android";


// ...additional event handlers here...
$.getScript('lib/paho-mqtt.js', function(){

mqtt_client = new Paho.MQTT.Client(app_host, 1883, app_clientID);
	
// set callback handlers
mqtt_client.onConnectionLost = onPahoConectionLost;
mqtt_client.onMessageArrived = onPahoMessageArived;	
	
//Update reconnect button
function updateReconnButton()
{
	if(mqtt_client.isConnected()){
		$("#button-conn-stat").html("Connected");
		//$("#button-conn-stat").attr('data-icon', "check").find('.ui-icon')
			//			.addClass('ui-icon-' + "refresh")
              //       	.removeClass('ui-icon-' + "check");
	}
	else{
		$("#button-conn-stat").html("Reconnect");
		//$("#button-conn-stat").attr('data-icon', "refresh").find('.ui-icon')
		//				.addClass('ui-icon-' + "check")
          //           	.removeClass('ui-icon-' + "refresh");
		
	}
}
//Update text containing packet
function updatePacketText(packet){
	$("#sent-to-leds").html("Sent to LED\'s: [" + packet.toString() + "]");
}
function updateFlipSwitches(packet)
{
	$('#select-led-red').val(colors[0]==1?'on':'off').slider("refresh");
	$('#select-led-green').val(colors[1]==1?'on':'off').slider("refresh");
	$('#select-led-blue').val(colors[2]==1?'on':'off').slider("refresh");
}

function changeLEDPacket()
{
	//Send command to device
	if(mqtt_client.isConnected()){
		pahoSendPacket(colors);
	}
	//Update text
	updatePacketText(colors);
}	

//Connection lost
function onPahoConectionLost()
{
	//Set username/pass, set callbacks and connect
	if(mqtt_client.isConnected() == false){
		mqtt_client.connect({userName:app_username, password:app_password, 
						 onSuccess:onPahoConected,onFailure:onPahoFailed});
	}
}
//Failed while connected
function onPahoFailed(a)
{
	alert("Failure connecting to MQTT server - please check credentials!");
	updateReconnButton();
}
//Success while connection
function onPahoConected()
{
	//Subscribe for device packets
	mqtt_client.subscribe("iot-2/type/"+dev_type+"/id/"+dev_id+"/evt/event/fmt/json");
	updateReconnButton();
	
}
//New message received
function onPahoMessageArived(msg)
{
	console.log(msg.payloadString);
	json_msg = JSON.parse(msg.payloadString);
	//Check the given input
	if(json_msg.r != undefined && json_msg.g != undefined && json_msg.b != undefined){
		colors[0] = json_msg.r;
		colors[1] = json_msg.g;
		colors[2] = json_msg.b;
		updatePacketText(colors);
		updateFlipSwitches(colors);
	}
}

//Function to send packet
function pahoSendPacket(packet)
{
	msg = new Paho.MQTT.Message('{"r":'+packet[0]+', "g":'+packet[1]+', "b":'+packet[2]+'}');
  	msg.destinationName = "iot-2/type/"+dev_type+"/id/"+dev_id+"/cmd/command/fmt/json";
  	mqtt_client.send(msg);
}
	
$("#button-conn-stat").click(function(){
	onPahoConectionLost();
});
	
$(document).ready( function()
{	
	//Initial connection, by issuing connection lost
	onPahoConectionLost();
	
	changeLEDPacket();
	
	$("#select-led-red").change(function(){
		colors[0] = $(this).val() == "on" ? 1 : 0;
		changeLEDPacket();
	});
	
	$("#select-led-green").change(function(){
		colors[1] = $(this).val() == "on" ? 1 : 0;
		changeLEDPacket();
	});
	
	$("#select-led-blue").change(function(){
		colors[2] = $(this).val() == "on" ? 1 : 0;
		changeLEDPacket();
	});
	
    
}); //Document loaded

}); //Paho loaded
