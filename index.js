var noble = require('noble');



var connectToPeripheral = function(callback){
	noble.on('stateChange', function(state) {
		if (state === 'poweredOn') {
			noble.startScanning([], false);
		} else {
			noble.stopScanning();
		}
	});

	noble.on('discover', function(peripheral) {
		var n = peripheral.advertisement.localName;
		if(peripheral.advertisement.localName)
			var i = peripheral.advertisement.localName.indexOf('Angel');
	    if(peripheral.advertisement.localName && peripheral.advertisement.localName.indexOf('Angel')>-1){
	    	peripheral.connect(function(error) {
	    		console.log('connected to peripheral: ' + peripheral.uuid + ' : ' + peripheral.advertisement.localName);
	    		callback(error, peripheral);
	    		// getStepCount(peripheral, function(error, stepCount){
	    		// 	console.log(stepCount);
	    		// });
	  		});
	    }
	});
}

var getStepCount = function(peripheral, callback){
	var serviceUuids=['68b527384a0440e18f83337a29c3284d'];
	var characteristicUuids=['7a5433056b9e4878ad6729c5a9d99736'];
	peripheral.discoverSomeServicesAndCharacteristics(serviceUuids, characteristicUuids, function(error, services, characteristics){
		if(error){
			callback(error, null);
		}
		else{
			var stepCharacteristic = characteristics[0];
			stepCharacteristic.read(function(error, data){
				if(error){
					callback(error, null);
				}
				else{
					callback(null, data[0])
				}
			});
		}
	});
}

var getHeartRate = function(peripheral, callback){
	var serviceUuids=['180D'];
	var characteristicUuids=['2a37'];
	peripheral.discoverSomeServicesAndCharacteristics(serviceUuids, characteristicUuids,function(error, services, characteristics){
		if(error){
			callback(error, null);
		}
		else{
			var heartCharacteristic = characteristics[0];

			heartCharacteristic.on('read', function(data, isNotification) {
          		callback(null, data[1]);
        	});
			heartCharacteristic.notify(true, function(error) {
          		console.log('heart rate notification on');
        	});
		}
	});
}

var getBloodOx= function(peripheral, callback){
	var serviceUuids=['902dcf38ccc04902b22c70cab5ee5df2'];
	var characteristicUuids=['b269c33fdf6b4c32801d1b963190bc71'];
	peripheral.discoverSomeServicesAndCharacteristics(serviceUuids, characteristicUuids,function(error, services, characteristics){
		if(error){
			callback(error, null);
		}
		else{
			var bloodCharacteristic = characteristics[0];

			bloodCharacteristic.on('read', function(data, isNotification) {
          		callback(null, data[1]);
        	});
			bloodCharacteristic.notify(true, function(error) {
          		console.log('blood ox notification on');
        	});
		}
	});
}

connectToPeripheral(function(error, peripheral){
	if(error)
		console.log(error);

	getStepCount(peripheral, function(error, stepCount){
		if(error)
			console.log(error);
		console.log('Step Count: ' + stepCount);

		getBloodOx(peripheral, function(error, heartRate){
		if(error)
			console.log(error);
		console.log('Heart Rate: ' + heartRate);
	});
	});

	
});

// noble.on('discover', function(peripheral) {
//     //console.log('Found device with local name: ' + peripheral.advertisement.localName);
//     if(peripheral.advertisement.localName==='Angel Sensor 06753'){
//     	peripheral.connect(function(error) {
//     		console.log('connected to peripheral: ' + peripheral.uuid);
//     		if(error){
//     			console.log('Error is: ' + error);
//     		}
//     		getStepCount(peripheral, function(error, stepCount){
//     			console.log(stepCount);
//     		});
//   		});
//     }
// });