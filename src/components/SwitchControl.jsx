export default function SwitchControl({ device, onToggle }) {
  const handleClick = () => {
    onToggle(device.id);
  };

  return (
    <button
      onClick={handleClick}
      className={`px-3 py-1 rounded-md ${
        device.isOn ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-500 hover:bg-green-600'
      } text-white`}
    >
      {device.isOn ? 'Desligar' : 'Ligar'}
    </button>
  );
}