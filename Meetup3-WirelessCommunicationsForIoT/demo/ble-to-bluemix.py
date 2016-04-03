#!/usr/bin/env python

import ibmiotf.device
from ibmiotf.codecs import jsonIotfCodec
import pexpect
import sys
import time
import subprocess

def signedFromHex16(s):
    v = int(s, 16)
    if not 0 <= v < 65536:
        raise ValueError, "hex number outside 16 bit range"
    if v >= 32768:
        v = v - 65536 
    return v

def initMQTT():
    deviceOptions = {"org": "fjryd1", "type": "Meetup_device", "id": "meetup3", "auth-method": "token", "auth-token": "meetup-token"}
    #Initialize MQTT device and open the connection
    deviceCli = ibmiotf.device.Client(deviceOptions)
    deviceCli.connect()
    return deviceCli

#Unblock bluetooth
subprocess.check_call(["rfkill", "unblock", "bluetooth"])
time.sleep(2)
print "Bluetooth unblocked"

bluetooth_adr = '98:4F:EE:0D:00:13'
tool = pexpect.spawn('/home/root/bluez-5.37/attrib/gatttool -b ' + 
bluetooth_adr + ' --interactive')
tool.expect('\[LE\]>')
print "Preparing to connect."
tool.sendline('connect')

# test for success of connect
tool.expect('Connection successful')
print "Curie Connected."

deviceCli = initMQTT()

while True:
    time.sleep(0.1)
    tool.sendline('char-read-hnd 0x0d')
    tool.expect('descriptor: .*') 
    rval = tool.after.split()

    accel_x = signedFromHex16(rval[1]+rval[2])
    accel_y = signedFromHex16(rval[3]+rval[4])
    accel_z = signedFromHex16(rval[5]+rval[6])

    dataPacket={"d":{"accel_x": accel_x, "accel_y": accel_y, "accel_z": accel_z}}
    deviceCli.publishEvent(event="data-stream", msgFormat="json",data=dataPacket)
