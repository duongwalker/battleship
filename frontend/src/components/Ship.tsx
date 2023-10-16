import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import Draggable from 'react-draggable';
import { atom, useRecoilState } from 'recoil';
interface ShipProps {
    id: string,
    url: string,
    width: any,
}

interface Cell {
    x: number;
    y: number;
}

export const cellReservationState = atom<Cell[]>({
    key: 'cellReservationState',
    default: [],
})

const Ship: React.FC<ShipProps> = ({ id, url, width}) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "ship",
        item: { id: id, location: undefined },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),

    }))

    const initialReservedCells: Cell[] = [];
    for (let i = 0; i < width/55; i++) {
        initialReservedCells.push({ x: i, y: 0 });
    }

    const [cellsReserved, setCellsReserved] = useRecoilState<Cell[]>(cellReservationState)
    useEffect(() => {
        setCellsReserved(initialReservedCells);
        // console.log(cellsReserved)
    }, [width]);

    const boardElement = document.getElementById('board')
    
    const offsetParent = boardElement || undefined
    const handleDrag = (e: any, ui: any) => {
        const { x, y } = ui;
        const translatedX = x / 55; 
        const translatedY = y / 55; 
        const reservedCells: Cell[] = [];
        for (let i = 0; i < width/55; i++) {
            reservedCells.push({ x: translatedX + i, y: translatedY });
        }
        setCellsReserved(reservedCells);
    };

    return (
        <Draggable grid={[55, 55]} bounds="parent" offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: 0, y: 0 }} onStop={handleDrag} >
            <img ref={(element) => drag(element)} src={url} width={width} height={50} style={{ border: "0px" }} alt='board-1' />
        </Draggable>
    )
}

export default Ship