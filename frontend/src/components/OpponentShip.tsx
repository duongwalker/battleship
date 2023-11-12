import React, { useState, useEffect, useRef } from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import Draggable from 'react-draggable';
import { atom, useRecoilState } from 'recoil';
import { cellReservationState } from './State';
interface ShipProps {
  id: string,
  url: string,
  width: any,
  location: [number, number]
  shipRefs: React.MutableRefObject<Record<string, HTMLImageElement | null>>;
  isHorizontal: boolean
}

type CellArray = [number, number];
interface ShipCells {
  id: string,
  cells: number[][]
}
const boardElement = document.getElementById('opponentBoard')

const offsetParent = boardElement || undefined

const OpponentShip: React.FC<ShipProps> = ({ id, url, width, location, shipRefs, isHorizontal }) => {
  const [rotationAngle, setRotationAngle] = useState(0);
  const shipRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    shipRefs.current[id] = shipRef.current;
  }, [id]);

  useEffect(() => {

    if (!isHorizontal) {
      console.log('Moi xoay doc xong')
      setRotationAngle(90)
      console.log(location)
    }
    else {
     
      setRotationAngle(0)
    }
  }, [id])

  // useEffect(() => {
  //   // Apply rotation to the element
  //   if (shipRef.current) {
  //     shipRef.current.style.transform = `rotate(${rotationAngle}deg)`;
  //   }
  // }, [rotationAngle]);


  return (
    <Draggable grid={[55, 55]} offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: location[0] * 55, y: location[1] * 55 }} onStart={() => false}>
      <span onContextMenu={(e) => e.preventDefault()} ref={shipRef}>
        <img ref={shipRef} id={id} src={url} width={width} height={50} alt='board-1' style={{ border: "0px", transform: `rotate(${rotationAngle}deg)`, transformOrigin: `${27.5}px 27.5px`, transition: 'transform 5s', zIndex: 2 }} />
      </span>
    </Draggable>
  )
}

export default OpponentShip