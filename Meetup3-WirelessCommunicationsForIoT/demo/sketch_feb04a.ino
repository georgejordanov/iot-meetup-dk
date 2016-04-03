#include <CurieBle.h>
#include <CurieImu.h>


// ====  create Nordic UART service =========
BLEPeripheral blePeripheral;       // BLE Peripheral Device (the board you're programming)

BLEService uartService = BLEService("6E400001B5A3F393E0A9E50E24DCCA9E");
// create characteristic
BLECharacteristic txCharacteristic = BLECharacteristic("6E400003B5A3F393E0A9E50E24DCCA9E", BLERead | BLENotify, 20); // == RX on central (android app)
BLECharacteristic rxCharacteristic = BLECharacteristic("6E400002B5A3F393E0A9E50E24DCCA9E", BLEWriteWithoutResponse, 20);  // == TX on central (android app)

void setup() {
 //Set uart
 Serial.begin(9600);    // initialize serial communication

 // initialize device
  CurieImu.initialize();

  // verify connection
  if (!CurieImu.testConnection()) {
    Serial.println("CurieImu connection failed");
  }
  
  // set advertised local name and service UUID
 blePeripheral.setLocalName("101 BLE");
 blePeripheral.setAdvertisedServiceUuid(uartService.uuid());

 // add service and characteristic
 blePeripheral.addAttribute(uartService);
 blePeripheral.addAttribute(rxCharacteristic);
 blePeripheral.addAttribute(txCharacteristic);

 // assign event handlers for connected, disconnected to peripheral
 //blePeripheral.setEventHandler(BLEConnected, blePeripheralConnectHandler);
 //blePeripheral.setEventHandler(BLEDisconnected, blePeripheralDisconnectHandler);

 // assign event handlers for characteristic
 //rxCharacteristic.setEventHandler(BLEWritten, rxCharacteristicWritten);

 // begin initialization
 blePeripheral.begin();

}

  
void blePeripheralConnectHandler(BLECentral& central) {
  // central connected event handler
  //central.connect();

  Serial.print("Connected to central!");
}

void loop() {
  
  // listen for BLE peripherals to connect:
  BLECentral central = blePeripheral.central();
  int accel_x = CurieImu.getAccelerationX();
  int accel_y = CurieImu.getAccelerationY();
  int accel_z = CurieImu.getAccelerationZ();
  
  if (central) {
    Serial.print("Connected to central: ");
    // print the central's MAC address:
    Serial.println(central.address());

    Serial.println(accel_x, HEX);

    const unsigned char payload[20] = { (char) (accel_x>>8), (char) (accel_x&0x00ff),
                                        (char) (accel_y>>8), (char) (accel_y&0x00ff),
                                        (char) (accel_z>>8), (char) (accel_z&0x00ff),
                                        0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00};
    txCharacteristic.setValue(payload, 20);  // and update the heart rate measurement characteristic

    delay(100);
 }

}
