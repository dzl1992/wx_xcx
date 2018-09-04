
/**
 * 1. 获取本机蓝牙适配器状态 wx.getBluetoothAdapterState
 * 2. 初始化蓝牙适配器 wx.openBluetoothAdapter()
 * 3. 启动蓝牙发现 wx.wx.startBluetoothDevicesDiscovery()
 * 4. 获取扫描到的所有设备 wx.getBluetoothDevices()
 * 
 * 
 * 参数：
 * @callback function 回调函数，用于接收返回值
 * 
 * 返回值：
 * ret:{isBluetoothAvailable:true, isBluetoothSearching:true, scanList:[]}
 * isBluetoothAvailable boolean 蓝牙适配器状态，true表示初始化蓝牙适配器成功
 * isBluetoothSearching boolean 蓝牙搜索状态，true表示开启蓝牙发现成功
 * scanList array 搜索的设备列表
 */
function scanDevices(callback) {
  //scanList格式如下：
  //[{RSSI:-xx, advertisServiceUUIDs:[], deviceId:'', name:''},{...}]
  //注意：Android系统的deviceId是设备的mac地址，iOS系统的deviceId是设备的UUID
  var ret = {
    isBluetoothAvailable: false,
    isBluetoothSearching: false,
    scanList: [],
  };

  if (typeof callback != "function") {
    console.log('Parameter callback is not a function');
    return;
  };

  /**
   * 获取蓝牙适配器状态
   */
  wx.getBluetoothAdapterState({
    success: function (res) {
      console.log("---getBluetoothAdapterState--success:", res)
      ret.isBluetoothAvailable = res.available;
      ret.isBluetoothSearching = res.discovering;
    },
    fail: function (res) {
      console.log("---getBluetoothAdapterState--fail:", res)
    },
    complete: function (res) {
      /**
       * 初始化蓝牙
       */
      if (!ret.isBluetoothAvailable) {
        wx.openBluetoothAdapter({
          success: function (res) {
            console.log("---openBluetoothAdapter--success:", res);
            ret.isBluetoothAvailable = true;
            startBluetoothDiscoveryAndScanDevice(ret, callback)
          },
          fail: function (res) {
            console.log("---openBluetoothAdapter--fail:", res);
            callback(ret);  //蓝牙初始化失败，直接返回，不进行后续搜索操作
            return;
          }
        });
      }
      else {
        startBluetoothDiscoveryAndScanDevice(ret, callback);
      }
    }
  });
}

function startBluetoothDiscoveryAndScanDevice(ret, callback) {
  /**
   * 开启蓝牙发现
   */
  if (!ret.isBluetoothSearching) {
    wx.startBluetoothDevicesDiscovery({
      services: [],
      allowDuplicatesKey: true,
      success: function (res) {
        console.log("---startBluetoothDevicesDiscovery--success: ", res);
        ret.isBluetoothSearching = res.isDiscovering;
      },
      fail: function (res) {
        console.log('---startBluetoothDevicesDiscovery--fail:', res);
        // 刷新页面后，开启蓝牙发现失败，暂时忽略10008错误
        // if (res.errCode != 10008) {
        //   callback(ret);
        // }
      },
      complete: function (res) {
        console.log('---startBluetoothDevicesDiscovery--complete:', res)
        if (res.errCode === 0 || res.errCode === 10008) {
          scanBluetoothDevice(ret, callback);
        }
        else {
          callback(ret);
        }
      }
    });
  }
  else {
    scanBluetoothDevice(ret, callback);
  }
}

function scanBluetoothDevice(ret, callback) {
  /**
  * 获取扫描到的所有设备
  */
  setTimeout(function () {
    wx.getBluetoothDevices({
      success: function (res) {
        //{devices: Array[11], errMsg: "getBluetoothDevices:ok"}
        console.log('---getBluetoothDevices--success:', res);
        var devArr = [];
        //根据广播UUID进行设备列表筛选
        for (var i = 0; i < res.devices.length; i++) {
          if (!('advertisServiceUUIDs' in res.devices[i])) {
            delete res.devices[i];
            continue;
          }
          for (let j = 0; j < res.devices[i].advertisServiceUUIDs.length; j++) {
            if (res.devices[i].advertisServiceUUIDs[j].toUpperCase().indexOf('FEF5') != -1) {
              devArr.push(res.devices[i]);
            }
          }
        }
        ret.scanList = devArr;
        callback(ret);
      },
      fail: function (res) {
        console.log('---getBluetoothDevices--fail:', res);
        callback(ret);
      }
    });
  }, 3000);
}

/**
 * 
 * 参数：
 * @deviceid String 参考scanDevices方法
 * @sendData String 发送到设备的开门指令
 * @callback function 回调函数，用于处理返回值
 * 
 * 返回值：
 * ret{errCode:'', errMsg:'', receiveData:''}
 * errCode: 错误码, 0表示开门成功
 * errMsg: 错误信息，Ok表示开门成功
 * receiveData: 接收的设备消息，消息内容为ac1c8表示开门成功
 */
function openDoor(deviceid, sendData, callback) {
  var ret = {
    errCode: 0,
    errMsg: 'Ok',
    receiveData: ''
  };

  if (typeof callback != "function") {
    ret.errCode = 6;
    ret.errMsg = 'parameter callback is not a function';
    callback(ret);
    return;
  }
  else if (typeof deviceid != "string" || deviceid === '') {
    ret.errCode = 4;
    ret.errMsg = 'deviceId is not a string type or is empty';
    callback(ret);
    return;
  }
  else if (typeof sendData != "string" || sendData === '') {
    ret.errCode = 5;
    ret.errMsg = 'sendData is not a string type or is empty';
    callback(ret);
    return;
  }

  var serviceId = '';
  var characteristics = [];
  var notifyCharacter = '';
  var writeCharacter = '';
  var readCharacter = '';
  var deviceId = deviceid.toUpperCase();

  //BLE蓝牙连接
  wx.createBLEConnection({
    deviceId: deviceId,
    success: function (res) {
      console.log('---createBLEConnection--success:', res);

      /**
       * 监听特定BLE设备连接状态变化
       */
      wx.onBLEConnectionStateChange(function (res) {
        // 该方法回调中可以用于处理连接意外断开等异常情况
        console.log(`device ${res.deviceId} state has changed, connected: ${res.connected}`)
      });

      //获取指定设备的所有服务
      wx.getBLEDeviceServices({
        deviceId: deviceId,
        success: function (res) {

          //筛选指定的服务UUID
          for (var i = 0; i < res.services.length; i++) {
            if (res.services[i].uuid.toLowerCase().indexOf('0886') != -1 ||
              res.services[i].uuid.toLowerCase().indexOf('ffe0') != -1) {
              serviceId = res.services[i].uuid;
              break;
            }
          }

          /**
           * 获取指定服务下的所有特征值
           */
          wx.getBLEDeviceCharacteristics({
            deviceId: deviceId,
            serviceId: serviceId,
            success: function (res) {
              for (var i = 0; i < res.characteristics.length; i++) {
                if (res.characteristics[i].uuid.toLowerCase().indexOf('878b') != -1) {
                  notifyCharacter = res.characteristics[i].uuid;
                }
                else if (res.characteristics[i].uuid.toLowerCase().indexOf('878c') != -1) {
                  writeCharacter = res.characteristics[i].uuid;
                  readCharacter = res.characteristics[i].uuid;
                }
              }

              /**
               * 启用低功耗蓝牙设备特征值变化时的 notify 功能
               */
              wx.notifyBLECharacteristicValueChange({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: notifyCharacter,
                state: true,
                success: function (res) {
                  console.log('---notifyBLECharacteristicValueChange--success:', res.errMsg);
                }
              });

              /**
               * 监听低功耗蓝牙设备的特征值变化
               */
              wx.onBLECharacteristicValueChange(function (res) {
                console.log(`characteristic ${res.characteristicId} has changed, now is ${res.value}`);
                let buffer = res.value;
                let dataView = new DataView(buffer);
                let receiveData = '';
                for (let i = 0; i < buffer.byteLength; i++) {
                  receiveData += dataView.getUint8(i).toString(16);
                }
                if (receiveData != 'ac1c8') {
                  ret.errCode = 7;
                  ret.errMsg = "paramater 'sendData' is incorrect."
                }
                ret.receiveData = receiveData;
                callback(ret);
              });

              //向蓝牙设备发送20字节16进制数据
              var buffer = new ArrayBuffer(20);
              var dataView = new DataView(buffer);
              var data = sendData;
              for (let i = 0; i < (data.length) / 2; i++) {
                var subData = data.slice(2 * i, 2 * i + 2);
                dataView.setUint8(i, parseInt('0x' + subData));
              }

              /**
               * 写入特征值下的二进制数据
               * 
               */
              setTimeout(function () {
                wx.writeBLECharacteristicValue({
                  deviceId: deviceId,
                  serviceId: serviceId,
                  characteristicId: writeCharacter,
                  value: buffer,
                  success: function (res) {
                    console.log('---writeBLECharacteristicValue-success:', res);
                  },
                  fail: function (res) {
                    ret.errCode = res.errCode; //3
                    ret.errMsg = 'writeBLECharacteristicValue fail';
                    callback(ret);
                  },
                })
              }, 500);
            },

            fail: function (res) {
              ret.errCode = res.errCode; //2
              ret.errMsg = 'getBLEDeviceCharacteristics fail';
              callback(ret);
            },
          })
        },
      })
    },
    fail: function (res) {
      ret.errCode = res.errCode;  //1
      ret.errMsg = 'createBLEConnection fail';
      callback(ret);
    },
  });
}

module.exports = {
  scanDevices: scanDevices,
  openDoor: openDoor
}