import './App.css';
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DragDrop from './components/DragDrop';
import { cellReservationState } from './components/Ship';
import { useRecoilValue } from 'recoil';
import { useState, useEffect } from 'react'
import Board from './components/Board';
function App() {

  interface ButtonProps {
    color: string;
    onClick: () => void;
  }

  type Reservation = {
    x: number;
    y: number;
  };
  const reservation: Reservation[] = useRecoilValue(cellReservationState)
  const [totalReservations, setTotalReservations] = useState<Reservation[][]>([]);

  const onClick = () => {
    // console.log(reservation)
  }

  useEffect(() => {
    setTotalReservations(prevState => {
      const newState = [...prevState, reservation];
      console.log(newState); // Log the updated state immediately after setting it
      return newState;
    });
  }, [reservation])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        {/* <DragDrop /> */}
        <Board />
      </div>
    </DndProvider>
  );
}

export default App;
