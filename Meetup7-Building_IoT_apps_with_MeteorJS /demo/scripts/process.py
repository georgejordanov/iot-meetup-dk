#!/usr/bin/env python

""" Check to see if an process is running. If not, restart. Run this in a cron job """
import os
import sys 
import time
import fcntl, socket, struct
from MeteorClient import MeteorClient
# client = MeteorClient('ws://127.0.0.1:3030/websocket')
client = MeteorClient('ws://127.0.0.1:3000/websocket')
process_name= "/root/smartag-python.py" # change this to the name of your process
#process_name= "meteor_run.sh"
# process_name= "/home/atanas/MeteorProjects/iot/serverstate.py"

def getHwAddr(ifname):
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
    return ':'.join(['%02x' % ord(char) for char in info[18:24]])
print getHwAddr('eth0')	
    # new part
newmac = getHwAddr('eth0')
client.connect()


tmp = os.popen("ps -Af").read()
print tmp[:]


if process_name in tmp[:]:
    print "LOCAL SERVER RUNNING"
    print process_name
    client.call('systemonboot', [newmac])
if process_name not in tmp[:]:
    print "The process is not running."
    client.call('systemfail', [newmac])



sys.exit(0)
