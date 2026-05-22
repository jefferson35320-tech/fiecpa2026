import { useState } from 'react';
import { DEVICE_TYPES, deviceMetadata } from '../types/deviceTypes';

export default function AddDeviceForm({ onAdd }) {
  const [type, setType] = useState(DEVICE_TYPES.LAMP);
  const [name, setName] = useState('');
  const [sensorType, setSensorType] = useState('presence');
  const [interruptor, setInterruptor] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Digite um nome para o dispositivo');
      return;
    }

    let deviceData = { type, name: name.trim() };

    if (type === DEVICE_TYPES.SENSOR) {
      deviceData.sensorType = sensorType;
      deviceData.sensorValue = sensorType === 'presence' ? 'vazio' : 0;
    } else if (type === DEVICE_TYPES.LED && interruptor.trim()) {
      deviceData.interruptorVinculado = interruptor.trim();
      deviceData.isOn = false;
    } else if (type === DEVICE_TYPES.LAMP) {
      deviceData.isOn = false;
    }

    onAdd(deviceData);
    setName('');
    setInterruptor('');
    setError('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Adicionar novo dispositivo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {Object.entries(deviceMetadata).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.icon} {meta.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome do dispositivo"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
        </div>

        {type === DEVICE_TYPES.SENSOR && (
          <div>
            <label className="block text-sm font-medium">Tipo de sensor:</label>
            <select
              value={sensorType}
              onChange={(e) => setSensorType(e.target.value)}
              className="mt-1 px-3 py-2 border rounded-lg"
            >
              <option value="presence">Presença</option>
              <option value="luminosity">Luminosidade</option>
              <option value="temperature">Temperatura (simulado)</option>
            </select>
          </div>
        )}

        {type === DEVICE_TYPES.LED && (
          <div>
            <label className="block text-sm font-medium">Nome do interruptor (opcional):</label>
            <input
              type="text"
              value={interruptor}
              onChange={(e) => setInterruptor(e.target.value)}
              placeholder="Ex: Interruptor da Sala"
              className="mt-1 w-full px-4 py-2 border rounded-lg"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
}