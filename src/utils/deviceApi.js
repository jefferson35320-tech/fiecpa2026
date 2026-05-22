// src/utils/deviceApi.js
import { DEVICE_TYPES } from '../types/deviceTypes';

let devices = [
  { id: 1, type: DEVICE_TYPES.LAMP, name: 'Lâmpada Sala', isOn: false },
  { id: 2, type: DEVICE_TYPES.LAMP, name: 'Lâmpada Quarto', isOn: true },
  { id: 3, type: DEVICE_TYPES.SENSOR, name: 'Sensor Presença Sala', sensorValue: 'detectado', sensorType: 'presence' },
  { id: 4, type: DEVICE_TYPES.SENSOR, name: 'Sensor Luminosidade Jardim', sensorValue: 320, sensorType: 'luminosity', unit: 'lux' },
  { id: 5, type: DEVICE_TYPES.LED, name: 'LED Cozinha', isOn: false, interruptorVinculado: 'Interruptor Parede' },
];
let nextId = 6;

export const getDevices = () => Promise.resolve([...devices]);

export const addDevice = (deviceData) => {
  const novo = { id: nextId++, ...deviceData };
  if (novo.type === DEVICE_TYPES.SENSOR) {
    if (!novo.sensorValue) novo.sensorValue = '--';
    if (!novo.sensorType) novo.sensorType = 'generic';
  } else {
    if (novo.isOn === undefined) novo.isOn = false;
  }
  devices.push(novo);
  return Promise.resolve(novo);
};

export const toggleDevice = (id) => {
  const device = devices.find(d => d.id === id);
  if (device && (device.type === DEVICE_TYPES.LAMP || device.type === DEVICE_TYPES.LED)) {
    device.isOn = !device.isOn;
    return Promise.resolve(device);
  }
  return Promise.reject(new Error('Este dispositivo não pode ser ligado/desligado'));
};

export const deleteDevice = (id) => {
  devices = devices.filter(d => d.id !== id);
  return Promise.resolve();
};

export const updateSensorValue = (id, newValue) => {
  const sensor = devices.find(d => d.id === id && d.type === DEVICE_TYPES.SENSOR);
  if (sensor) {
    sensor.sensorValue = newValue;
    return Promise.resolve(sensor);
  }
  return Promise.resolve(null);
};