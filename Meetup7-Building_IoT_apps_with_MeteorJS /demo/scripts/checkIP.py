import commands

IP = commands.getoutput("hostname -I") 

if IP:
    print IP
else:
    print "NO Connection" 
