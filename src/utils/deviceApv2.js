// src/utils/deviceApi.js
import { deleteDevice, getDevices, registerDevice, updateDevice } from './deviceService';


export const getDevicesV2 = async () => {
  return await getDevices();
 
}

export const addDeviceV2 = async (deviceData) => {
  await registerDevice(deviceData);
  
};

export const toggleDeviceV2 = async (device, id) => {
  console.log(device)
  if (device && (device.tipo === "led")) {
    if(device.valor === 1){
      device.valor = 0;
    } else {
      device.valor = 1;
    }
    await updateDevice(device, id )
    return Promise.resolve(device);
  }
  return Promise.reject(new Error('Este dispositivo não pode ser ligado/desligado'));
};

export const deleteDeviceV2 = async (id) => {
  await deleteDevice(id);
};

