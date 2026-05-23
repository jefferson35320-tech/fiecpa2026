import { deviceMetadataV2 } from '../types/deviceTypes';

export default function SensorReadOnlyV2({ device, onDelete }) {
  const { id, tipo, valor } = device;
  const meta = deviceMetadataV2[tipo];
  
  

  return (
    <div className="p-4 rounded-lg shadow-md bg-gray-50 border-l-4 border-blue-400">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-2xl mr-2">{meta.icon}</span>
          <h3 className="text-xl font-semibold inline">{tipo}</h3>
          <span className="ml-2 text-sm text-gray-500">(Sensor)</span>
        </div>
        <button
          onClick={() => onDelete(id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
        >
          Excluir
        </button>
      </div>
      <p className="text-sm mt-2">Leitura atual: <strong>{valor}</strong></p>
      <p className="text-xs text-gray-400">Tipo: {tipo}</p>
    </div>
  );
}