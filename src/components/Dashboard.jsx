import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDevices, addDevice, toggleDevice, deleteDevice, updateSensorValue } from '../utils/deviceApi';
import DeviceCard from './DeviceCard';
import AddDeviceForm from './AddDeviceForm';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carregar dispositivos
  useEffect(() => {
    getDevices().then(data => {
      setDevices(data);
      setLoading(false);
    });
  }, []);

  // Simular atualização periódica dos sensores (exemplo)
  useEffect(() => {
    const interval = setInterval(() => {
      devices.forEach(device => {
        if (device.type === 'sensor' && device.sensorType === 'presence') {
          // Alterna presença aleatoriamente para demonstração
          const newValue = Math.random() > 0.7 ? 'detectado' : 'vazio';
          updateSensorValue(device.id, newValue).then(updated => {
            if (updated) {
              setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
            }
          });
        } else if (device.type === 'sensor' && device.sensorType === 'luminosity') {
          const newLux = Math.floor(Math.random() * 500);
          updateSensorValue(device.id, newLux).then(updated => {
            if (updated) setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
          });
        }
      });
    }, 5000); // a cada 5 segundos
    return () => clearInterval(interval);
  }, [devices]);

  const handleAdd = async (deviceData) => {
    const novo = await addDevice(deviceData);
    setDevices(prev => [...prev, novo]);
  };

  const handleToggle = async (id) => {
    const atualizado = await toggleDevice(id);
    setDevices(prev => prev.map(d => d.id === id ? atualizado : d));
  };

  const handleDelete = async (id) => {
    await deleteDevice(id);
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="text-center p-8">Carregando dispositivos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Automação Residencial</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Olá, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>

        <AddDeviceForm onAdd={handleAdd} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {devices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {devices.length === 0 && (
          <p className="text-center text-gray-500 mt-8">
            Nenhum dispositivo cadastrado. Adicione lâmpadas, sensores ou LEDs!
          </p>
        )}
      </div>
    </div>
  );
}