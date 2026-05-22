// Tipos de dispositivos suportados
export const DEVICE_TYPES = {
  LAMP: 'lamp',
  SENSOR: 'sensor',
  LED: 'led',
};

// Metadados para cada tipo (usados na UI)
export const deviceMetadata = {
  [DEVICE_TYPES.LAMP]: {
    name: 'Lâmpada',
    icon: '💡',
    hasOnOff: true,
    canToggle: true,
    isSensor: false,
  },
  [DEVICE_TYPES.SENSOR]: {
    name: 'Sensor',
    icon: '📡',
    hasOnOff: false,     // sensores são apenas leitura, não se liga/desliga
    canToggle: false,
    isSensor: true,
    // Possíveis propriedades: tipoSensor (presença, luminosidade, temperatura)
  },
  [DEVICE_TYPES.LED]: {
    name: 'LED',
    icon: '🔆',
    hasOnOff: true,
    canToggle: true,     // pode ser ligado/desligado via interruptor
    isSensor: false,
  },
};