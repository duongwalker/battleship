import { useEffect, useState, useContext, useRef } from 'react'
import './Board.css'
import Cell from './Cell'
import Ship from './Ship';
import { useDrop } from 'react-dnd';
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil';
import { cellReservationState } from './State';
import { cellShootedState, playerIdState } from "./State";
import socket from './socket';
import OpponentShip from './OpponentShip';
const verticalAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const horizontalAxis = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

interface Ship {
  id: string;
  name: string;
  img: any;
  width: any;
  // location?: [number, number][]
}

interface OpponentShipInterface {
  id: string;
  cells: [number, number][]
  count: number,
  isHorizontal: boolean
}

interface ShipCells {
  id: string,
  cells: number[][],
  count: number,
  isHorizontal: boolean
}

interface ShootedShip {
  id: string;
  playerId: string;
}

interface ShootedCell {
  cell: [number, number],
  playerId: string
}

type CellArray = [number, number]

const OpponentBoard = () => {
  const [opponentShipList, setOpponentShipList] = useState<OpponentShipInterface[]>([])
  const [sinkedShip, setSinkedShip] = useState<ShipCells[]>([])
  const shootedCell = useRecoilValue<CellArray>(cellShootedState)
  const cellsReserved = useRecoilValue<ShipCells[]>(cellReservationState)
  const playerId = useRecoilValue(playerIdState)
  const shipList: Ship[] = [
    { id: `ship3`, name: 'Ship 3', img: '/boat-3.jpg', width: 275 },
    { id: `ship2`, name: 'Ship 2', img: '/boat-2.png', width: 110 },
    { id: `ship1`, name: 'Ship 1', img: '/boat.png', width: 165 },
  ];


  // const shipList: Ship[] = [
  //   { id: 'ship3', name: 'Ship 3', img: '/boat-3.jpg', width: 275, location: opponentShipList[0]['cells'] },
  //   { id: 'ship2', name: 'Ship 2', img: '/boat-2.png', width: 110 , location: opponentShipList[1].cells },
  //   { id: 'ship1', name: 'Ship 1', img: '/boat.png', width: 165 , location: opponentShipList[2].cells },
  // ];

  let board = [];

  for (let i = 0; i < horizontalAxis.length; i++) {
    for (let j = 0; j < verticalAxis.length; j++) {
      board.push(<Cell id={playerId} key={`${i},${j}`} value={[verticalAxis[j], horizontalAxis[i]]} className='opponentCell' />)
    }
  }

  useEffect(() => {
    socket.on("opponentShipData", (data) => {
      setOpponentShipList(data)
      console.log(data)
    });
  }, [socket]);

  useEffect(() => {
    const newSinkedShip = cellsReserved.map((ship) => {
      if (ship.count === 0) {
        return ship;
      } else {
        return null;
      }
    });

    const filteredSinkedShip = newSinkedShip.filter((ship): ship is ShipCells => ship !== null);
    if (filteredSinkedShip.length > 0) {
      setSinkedShip(filteredSinkedShip);
    }
  }, [cellsReserved]);


  const shipRefs = useRef<Record<string, HTMLImageElement | null>>({});
  useEffect(() => {
    const shootedShip = sinkedShip.map((ship) => {
        return ship.id
    });
    socket.emit('checkEvent', shootedShip)

  }, [sinkedShip, shipRefs]);

  useEffect(() => {
    socket.on('checkResult', (events: string[]) => {
      console.log('Len 100 deeee')
      events.forEach((event) => {
          const imgElement = shipRefs.current[event];
          console.log(`this is img element`);
          console.log(imgElement);
          if (imgElement) {
            imgElement.style.zIndex = '100';
          }
      });
    })

  }, [socket])

  return (
    <div className='boards-container'>
      <div id='opponentBoard'>
        {board}
        {opponentShipList && opponentShipList.map((ship, index) => {
          return (
            <OpponentShip key={ship.id} id={ship.id} url={shipList[index].img} width={shipList[index].width} location={ship.cells[0]} shipRefs={shipRefs} isHorizontal = {ship.isHorizontal}/>
          )
        })}

        <button>Hello</button>
      </div>
    </div>
  )
}

export default OpponentBoard