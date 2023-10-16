import { useState } from 'react'
import './Board.css'
import Cell from './Cell'
import Ship from './Ship';
import { useDrop } from 'react-dnd';
import { RecoilRoot, useRecoilValue } from 'recoil';

const verticalAxis = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const horizontalAxis = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']

const Board = () => {
  interface Ship {
    id: string;
    name: string;
    img: any;
    width: any;
    location?: { x: number; y: number }
  }



  const shipList: Ship[] = [
    { id: 'ship2', name: 'Ship 2', img: '/boat-2.png', width: 110 },
    { id: 'ship3', name: 'Ship 3', img: '/boat-3.jpg', width: 275 },
    { id: 'ship1', name: 'Ship 1', img: '/boat.png', width: 165 },
  ];

  const [shipsOnBoard, setShipsOnBoard] = useState<Ship[]>([])

  // const [{ isOver }, drop] = useDrop(() => ({
  //   accept: "ship",
  //   drop: (ship: any, monitor) => {
  //     const boardElement = document.getElementById('board');

  //     if (boardElement) {
  //       const boardRect = boardElement.getBoundingClientRect();
  //       const dropPosition = monitor.getSourceClientOffset();

  //       if (dropPosition) {
  //         console.log(dropPosition)
  //         const x = Math.floor((dropPosition.x - boardRect.left) / 55);
  //         const y = Math.floor((dropPosition.y - boardRect.top) / 55);

  //         const selectedShip = shipList.find(s => s.id === ship.id)
  //         if (selectedShip) {
  //           const shipWithLocation: Ship = {
  //             ...selectedShip,
  //             location: { x, y }
  //           };
  //           setShipsOnBoard(prevShips => [...prevShips, shipWithLocation]);
  //         }
  //       }

  //     }
  //   },
  //   collect: (monitor) => ({
  //     isOver: !!monitor.isOver(),
  //   })
  // }))

  let board = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      board.push(<Cell key={`${i}${j}`} value={`${horizontalAxis[i]}${verticalAxis[j]}`} />)
    }
  }

  return (
    <div id='board'>
      {shipList.map((ship) => {
        return (
          <Ship key={ship.id} id={ship.id} url={ship.img} width={ship.width} />
        )
      })}
      {board}
      
    </div>
  )
}

export default Board;