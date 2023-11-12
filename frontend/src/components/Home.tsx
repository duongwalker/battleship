import { useState, ChangeEvent } from 'react';

const Home = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [newRoom, setNewRoom] = useState<string>('');

  const handleAddRoom = () => {
    if (newRoom !== '') {

      setRooms(prev => [...prev, newRoom]);
      setNewRoom('');
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setNewRoom(value)
  };

  return (
    <div>
      <input onChange={handleOnChange} value={newRoom} />
      <button onClick={handleAddRoom}>Create Room</button>

      <ul>
        {/* Map over the rooms and display them as a list */}
        {rooms.map((room, index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </div>
  );
};

export default Home;
