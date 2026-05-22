import { DEVICE_TYPES, deviceMetadata } from '../types/deviceTypes';
import SensorReadOnly from './SensorReadOnly';
import SwitchControl from './SwitchControl';

export default function DeviceCard({ device, onToggle, onDelete }) {
  const { id, type, name } = device;
  const meta = deviceMetadata[type];

  if (type === DEVICE_TYPES.SENSOR) {
    return <SensorReadOnly device={device} onDelete={onDelete} />;
  }

  // Lâmpada ou LED (possuem interruptor)
  return (
    <div className={`p-4 rounded-lg shadow-md transition-all ${device.isOn ? 'bg-yellow-100 border-l-8 border-yellow-500' : 'bg-white'}`}>
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl mr-2">{meta.icon}</span>
          <h3 className="text-xl font-semibold inline">{name}</h3>
          <span className="ml-2 text-sm text-gray-500">({meta.name})</span>
        </div>
        <div className="flex gap-2">
          <SwitchControl device={device} onToggle={onToggle} />
          <button
            onClick={() => onDelete(id)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Excluir
          </button>
        </div>
      </div>
      {device.interruptorVinculado && (
        <p className="text-xs text-gray-500 mt-1">Interruptor: {device.interruptorVinculado}</p>
      )}
      <p className="text-sm mt-2">Status: {device.isOn ? '🔆 Ligado' : '⚫ Desligado'}</p>
    </div>
  );
}