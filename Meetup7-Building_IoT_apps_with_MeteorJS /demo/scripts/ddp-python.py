import time
import fcntl, socket, struct
import RPi.GPIO as GPIO
import Adafruit_DHT

sensor = Adafruit_DHT.DHT11
pin = 4
a = 0
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

GPIO.setmode(GPIO.BOARD)
GPIO.setup(12, GPIO.OUT)
GPIO.setup(16, GPIO.OUT)
GPIO.setup(18, GPIO.OUT)
GPIO.setup(22, GPIO.OUT)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(15, GPIO.OUT)


from MeteorClient import MeteorClient





client = MeteorClient('ws://127.0.0.1:3000/websocket')
#client = MeteorClient('ws://testddp.meteor.com/websocket')

def subscribed(subscription):
    print('* SUBSCRIBED {}'.format(subscription))
    # conn = client.find_one('items', selector={'name': getHwAddr('eth0') })
    if subscription == 'local-items':
        def getHwAddr(ifname):
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
            return ':'.join(['%02x' % ord(char) for char in info[18:24]])
        print getHwAddr('eth0') 
        # new part
        newmac = getHwAddr('eth0')
        conn = client.find_one('items', selector={'name': newmac })
        print(format(conn))
        if conn:
            client.update('items' , {'name':  getHwAddr('eth0')} , {'status': 'NOT Active'})
        else:     
        # old part
            client.insert('items', {'name':  getHwAddr('eth0') ,   'author': 'Python', 'status': 'Active'})

def unsubscribed(subscription):
    print('* UNSUBSCRIBED {}'.format(subscription))
    client.update('items' , {'name':  'c4:54:44:84:70:b4' }, {'status': 'Not Active'})

def added(collection, id, fields):
    print('* ADDED {} {}'.format(collection, id))
    for key, value in fields.items():
        print('  - FIELD {} {}'.format(key, value))

    # query the data each time something has been added to
    # a collection to see the data `grow`
    all_lists = client.find('items', selector={})
    print('Items: {}'.format(all_lists))
    print('Num Items: {}'.format(len(all_lists)))

    # if collection == 'list' you could subscribe to the list here
    # with something like
    # client.subscribe('todos', id)
    # all_todos = client.find('todos', selector={})
    # print 'Todos: {}'.format(all_todos)

def changed(collection, id, fields, cleared):
    print('* CHANGED {} {} {}'.format(collection, id, fields))
    for key, value in fields.items():
        print('  - FIELD {} {}'.format(key, value))
    for key, value in cleared.items():
        print('  - CLEARED {} {}'.format(key, value))
    if collection == 'leds':
        print('* collection leds')
        ledcontrol = client.find_one('leds', selector={'_id': id})
        # print(format(ledcontrol))
        if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1a328536fa0c9a622162':
            print('* LED1 CHECKED FALSE')
            GPIO.output(16, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1a328536fa0c9a622162':
            print('* LED1 CHECKED True')
            GPIO.output(16, True)
        if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1ab28536fa0c9a622163':
            print('* LED2 CHECKED FALSE')
            GPIO.output(12, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1ab28536fa0c9a622163':
            print('* LED2 CHECKED True')
            GPIO.output(12, True)
        if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1ad98536fa0c9a622164':
            print('* LED3 CHECKED FALSE')
            GPIO.output(18, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1ad98536fa0c9a622164':
            print('* LED3 CHECKED True')
            GPIO.output(18, True)
	if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1aeb8536fa0c9a622165':
            print('* LED4 CHECKED FALSE')
            GPIO.output(22, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1aeb8536fa0c9a622165':
            print('* LED4 CHECKED True')
            GPIO.output(22, True)
	if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1af78536fa0c9a622166':
            print('* LED5 CHECKED FALSE')
            GPIO.output(11, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1af78536fa0c9a622166':
            print('* LED5 CHECKED True')
            GPIO.output(11, True)
	if ledcontrol['checked'] == False and ledcontrol['_id'] == '-569c1b118536fa0c9a622167':
            print('* LED6 CHECKED FALSE')
            GPIO.output(15, False)
        if ledcontrol['checked'] == True and ledcontrol['_id'] == '-569c1b118536fa0c9a622167':
            print('* LED6 CHECKED True')
            GPIO.output(15, True)       
    
        

def connected():
    print('* CONNECTED')
    # def getHwAddr(ifname):
    # 	s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    # 	info = fcntl.ioctl(s.fileno(), 0x8927,  struct.pack('256s', ifname[:15]))
    # 	return ':'.join(['%02x' % ord(char) for char in info[18:24]])
    # print getHwAddr('eth0')	
    # # new part
    # newmac = getHwAddr('eth0')
    # conn = client.find_one('items', selector={'name': getHwAddr('eth0') })
    # print conn
    # if conn:
    #     client.update('items' , {'name':  getHwAddr('eth0')} , {'status': 'Active'})
    # else:     
    # # old part
    #     client.insert('items', {'name':  getHwAddr('eth0') ,   'author': 'Python', 'status': 'Active'})
    #while a < 1000000:
    #    a += 1
    #    if a == 999999:
        
    if humidity is not None and temperature is not None:
        print 'Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity)
    else:
        print 'Failed to get reading. Try again!'
    #            a = 0      

def subscription_callback(error):
    if error:
        print(error)

# def closed(self, code, reason):
#     print('* CONNECTION CLOSED {} {}'.format(code, reason))



client.on('subscribed', subscribed)
client.on('unsubscribed', unsubscribed)
client.on('added', added)
client.on('connected', connected)
# client.on('closed', closed)
client.on('changed', changed)
client.connect()
client.subscribe('local-items')
client.subscribe('local-leds')
client.subscribe('local-sensors')


# (sort of) hacky way to keep the client alive
# ctrl + c to kill the script
while True:
    try:
        time.sleep(1)
        while a < 20000000:
            a += 1
            if a == 19999999:
                humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)
                #timenow = time.strftime("%X")
                timenow = time.asctime( time.localtime(time.time()) )
                if humidity is not None and temperature is not None:
                    print 'Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity)
                    #client.insert('sensors', {'name': 'DHT11 SENSOR 1' ,'temperature':  temperature ,   'humidity': humidity , 'time': timenow})
                    client.call('sensordata' , [temperature, humidity])
                else:
                    print 'Failed to get reading. Try again!'
                a = 0  
    except KeyboardInterrupt:
        break


# client.update('items' , {'name':  'c4:54:44:84:70:b4' }, {'status': 'Not Active'})
client.unsubscribe('local-items')
client.unsubscribe('local-leds')
client.unsubscribe('local-sensors')
