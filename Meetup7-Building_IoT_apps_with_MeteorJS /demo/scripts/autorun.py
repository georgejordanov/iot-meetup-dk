






#!/usr/bin/env python

""" Check to see if an process is running. If not, restart. Run this in a cron job """
import os
process_name= "/root/smartag-python.py" # change this to the name of your process
#process_name= "meteor_run.sh"
tmp = os.popen("ps -Af").read()
print tmp[:]

if process_name in tmp[:]:
    print "LOCAL SERVER RUNNING"
    print process_name
    
if process_name not in tmp[:]:
    print "The process is not running. Let's restart."
    """"Use nohup to make sure it runs like a daemon"""
    newprocess="nohup python %s &" % (process_name)
    
    os.system(process_name)
else:
    print "The process is running"




