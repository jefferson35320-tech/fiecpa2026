import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import store from '../store/store';
import { addDeviceV2, deleteDeviceV2, getDevicesV2, toggleDeviceV2 } from '../utils/deviceApv2';
import DeviceCard2 from './DeviceCard2';
import AddDeviceFormV2 from './AddDeviceFormV2';

export default function Dashboard2() {
  const { user, resetUser } = store();
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDevices = () => {
    getDevicesV2().then(data => {
      setDevices(data);
      setLoading(false);
    });
  }

  // Carregar dispositivos
  useEffect(() => {
    getDevices()
  }, []);

  // Simular atualização periódica dos sensores (exemplo)
  useEffect(() => {
    const interval = setInterval(() => {
      getDevices()
    }, 5000); // a cada 5 segundos
    return () => clearInterval(interval);
  }, [devices]);

  const handleAdd = async (deviceData) => {
    await addDeviceV2(deviceData);
    await getDevices();
  };

  const handleToggle = async (id) => {
     const device = devices.find(d => d.id === id);
     await toggleDeviceV2(device, id);
     await getDevices();
  };

  const handleDelete = async (id) => {
    await deleteDeviceV2(id);
    await getDevices();
  };

  const handleLogout = () => {
    resetUser();
    navigate('/');
  };

  if (loading) return <div className="text-center p-8">Carregando dispositivos...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Automação Residencial</h1>
          <div className="flex items-center gap-4">
            <Link to={"/dashboard"} >Amostra</Link>
            <Link to={"/dashboardV2"}>Real</Link>
            <img
                                    className="h-10 w-10 rounded-full object-cover ring-2 ring-indigo-500 ring-offset-2"
                                    width={40}
                                    height={40}
                                    src={user.imagem}
                                    alt={user.nome}
                                />
            <span className="text-gray-600">Olá, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Sair
            </button>
          </div>
        </div>

        <AddDeviceFormV2 onAdd={handleAdd} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {devices.map(device => (
            <DeviceCard2
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