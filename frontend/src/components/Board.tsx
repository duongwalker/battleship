import { useEffect, useState } from 'react'
import './Board.css'
import Cell from './Cell'
import Ship from './Ship';
import { useDrop } from 'react-dnd';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { cellReservationState, playerIdState } from './State';
import * as io from "socket.io-client"

const verticalAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
interface Ship {
  id: string;
  name: string;
  img: any;
  width: any;
  location?: { x: number; y: number }
}
type CellArray = [number, number];
interface ShipCells {
  id: string,
  cells: number[][]
}

const Board = () => {
  const playerId = useRecoilValue(playerIdState)
  
  const shipList: Ship[] = [
    { id: 'ship1', name: 'Ship 1', img: '/boat.png', width: 165 },
    { id: 'ship2', name: 'Ship 2', img: '/boat-2.png', width: 110 },
    { id: 'ship3', name: 'Ship 3', img: '/boat-3.jpg', width: 275 },
  ];

  
  let board = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      board.push(<Cell id = {playerId} key={`${i}${j}`} value={[verticalAxis[j], horizontalAxis[i] ]} className='cell'/>)
    }
  }

  return (
    <div className='boards-container'>
      <div id='board'>
        {shipList.map((ship) => {
          return (
            <Ship key={ship.id} id={ship.id} url={ship.img} width={ship.width} />
          )
        })}
        {board}
        
      </div>
    </div>
  )
}

export default Board;