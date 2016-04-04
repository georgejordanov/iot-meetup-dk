/*jslint node:true, vars:true, bitwise:true, unparam:true */
/*jshint unused:true */
var mraa = require("mraa"); //require mraa
var ibmiotf = require('ibmiotf'); //require ibmiotf

var deviceCreds = require('./device.json');

var deviceCli = new ibmiotf.IotfDevice(deviceCreds);
var turnon = 0;
var eventTriggered = false;
var connectionAlive = false;

//Initialize Pin23 as gpio
var inPin = new mraa.Gpio(23);
//Initialize PWM on Digital Pin #20,21,14 and enable the pwm pin
var pwm = [new mraa.Pwm(14), new mraa.Pwm(21), new mraa.Pwm(20)];

//Enable PWMs
pwm.forEach(function(p){
    p.period_us(2000);
    p.enable(true);
    p.write(0);
});

//Set the pin as IN
inPin.dir(mraa.DIR_IN);
//Add internal Pull-up
inPin.mode(mraa.MODE_PULLUP);

deviceCli.connect();
led_control();

function buttonPressed()
{
    //Implements low pass filter
    if(eventTriggered == false){
        eventTriggered = true;

        turnon = turnon+1;
        if(turnon > 7){
            turnon = 0;
        }

        //Set the coresponding lights on
        pwm.forEach(function(p, i){
            p.write((turnon>>i) & 1);
        });
            
        if(connectionAlive == true){
            deviceCli.publish('event', 'json', '{"r":'+pwm[0].read()+', "g":'+pwm[1].read()+', "b":'+pwm[2].read()+'}', 2);
        }
            
        //Implements low pass filter //Waits half a sec before enabling the inner body call
        setTimeout(function(){eventTriggered = false;}, 300);
    }
}

function led_control(){

    //Generate interupt while pressing the button on the board
    inPin.isr(mraa.EDGE_FALLING, function(a){
        buttonPressed();
    });
    
    setInterval(function () {
    }, 500);

}

deviceCli.on('connect', function(){
    console.log('connected');
	connectionAlive = true;
});

deviceCli.on('error', function(err){
    console.log('error');
	connectionAlive = false;
});

deviceCli.on('command', function(commandName,format,payload,topic){
    var json_obj = JSON.parse(payload);
    turnon = (json_obj['r']*1 + json_obj['g']*2 + json_obj['b']*4) - 1;
    buttonPressed(true);
    console.log(json_obj);
});
