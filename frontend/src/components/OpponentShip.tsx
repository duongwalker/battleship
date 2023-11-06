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
}

type CellArray = [number, number];
interface ShipCells {
  id: string,
  cells: number[][]
}
const boardElement = document.getElementById('opponentBoard')

const offsetParent = boardElement || undefined

const OpponentShip: React.FC<ShipProps> = ({ id, url, width, location, shipRefs }) => {
  const shipRef = useRef<HTMLImageElement | null>(null);
  useEffect(() => {
    shipRefs.current[id] = shipRef.current;
  }, [id]);



  return (
    <Draggable grid={[55, 55]} bounds="parent" offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: location[0] * 55, y: location[1] * 55 }} onStart={() => false}>
      <img ref={shipRef} id={id} src={url} width={width} height={50} style={{ border: "0px", zIndex: 2 }} alt='board-1' />
    </Draggable>
  )
}

export default OpponentShip