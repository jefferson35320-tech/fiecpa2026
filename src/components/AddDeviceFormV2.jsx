import { useState } from 'react';
import { DEVICE_TYPES, deviceMetadataV2 } from '../types/deviceTypes';

export default function AddDeviceFormV2({ onAdd, userId }) {
  const [tipo, setTipo] = useState(DEVICE_TYPES.LED);
  const [porta, setPorta] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    let deviceData = { tipo, porta, userId};

    onAdd(deviceData);
 
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Adicionar novo dispositivo</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            {Object.entries(deviceMetadataV2).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.icon} {meta.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={porta}
            onChange={(e) => setPorta(e.target.value)}
            placeholder="Porta (de 4 a 22)"
            className="flex-1 px-4 py-2 border rounded-lg"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Adicionar
          </button>
        </div>

        
      </form>
    </div>
  );
}