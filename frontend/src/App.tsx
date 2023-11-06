import './App.css';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { cellReservationState } from './components/State';
import { cellShootedState } from './components/State';
import { useRecoilValue } from 'recoil';
import { useState, useEffect } from 'react'
import Board from './components/Board';
import OpponentBoard from './components/OpponentBoard';
import socket from './components/socket';
// import { SocketContext, socket } from './context/SocketContext';

function App() {

  const [room, setRoom] = useState('')
  const [username, setUsername] = useState("")
  interface ButtonProps {
    color: string;
    onClick: () => void;
  }
  interface ShipCells {
    id: string,
    cells: number[][]
    count: number
  }
  type Cell = [number, number]

  const cellsReservation = useRecoilValue<ShipCells[]>(cellReservationState);
  // const shootedCell = useRecoilValue<Cell>(cellShootedState)

  const [isButtonClickable, setIsButtonClickable] = useState(false);
  const checkForOverlap = (ships: ShipCells[]) => {
    const allCells: string[] = [];
    ships.forEach(ship => {
      ship.cells.forEach(cells => {
        allCells.push(cells.join(','));
      });
    });

    const uniqueCells = new Set(allCells);

    return allCells.length !== uniqueCells.size;
  }

  useEffect(() => {
    const hasOverlap = checkForOverlap(cellsReservation);
    setIsButtonClickable(!hasOverlap)

  }, [cellsReservation])

  const handleButtonClick = () => {
    joinRoom()
  }

  const sendingShips = {
    "ship1": ["A2", "A3", "A4"],
    "ship2": ["D2", "E2", "F2", "G2"],
    "ship3": ["I8", "I9"]
  }

  const joinRoom = async () => {
    if (username !== "" && room !== "") {
      await socket.emit('joinGameRoom', room, username, cellsReservation);
    }
  };

  return (
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <div className="board-container">
            <Board />
          </div>

          <div className="board-container">
            <OpponentBoard />
          </div>
        </div>


        <div>
          <input type="text"
            placeholder="Room ID..."
            onChange={(event) => {
              setRoom(event.target.value);
            }} />
          <input
            type="text"
            placeholder="Name..."
            onChange={(event) => {
              setUsername(event.target.value);
            }}
          />
          <button className={isButtonClickable ? '' : 'disabled-button'} onClick={isButtonClickable ? handleButtonClick : undefined} >Start game</button>
        </div>
      </DndProvider>
  );
}

export default App;
