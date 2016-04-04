#!/usr/bin/env python
import ibmiotf.device
from ibmiotf.codecs import jsonIotfCodec
from subprocess import Popen, PIPE
import time

#Set MQTT Device credentials - from bluemix iotf service
deviceOptions = {"org": "", "type": "", "id":
"edison_meetup1", "auth-method": "token", "auth-token":
""}

#Initialize MQTT device and open the connection
deviceCli = ibmiotf.device.Client(deviceOptions)
deviceCli.connect()
while True:
        process = Popen(["iwconfig", "wlan0"], stdout=PIPE)
        (out, err) = process.communicate()
        exit_code = process.wait()

        #Get signal strenght from iwconfig result
        ss = int(out.split("Signal level=")[1].split(" ")[0])
        dataPacket={"d":{"ss": ss}}
        deviceCli.publishEvent(event="data-stream", msgFormat="json", data=dataPacket)

        print dataPacket
        time.sleep(1)
