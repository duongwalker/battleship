import React, { useState, useEffect } from 'react';
import { useDrag } from 'react-dnd/dist/hooks';
import Draggable from 'react-draggable';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { cellReservationState, cellShootedState, playerIdState } from './State';
import Cell from './Cell';
import socket from "./socket";
import { v4 as uuidv4 } from 'uuid'
interface ShipProps {
    id: string,
    url: string,
    width: any,
}

type CellArray = [number, number];
interface ShipCells {
    id: string,
    cells: number[][],
    count: number,
}

// interface ShootedCell {
//     cell: [number, number],
//     playerId: string
// }
type ShootedCell = [number, number]


const Ship: React.FC<ShipProps> = ({ id, url, width }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "ship",
        item: { id: id, location: undefined },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),

    }))
    const [rotationAngle, setRotationAngle] = useState(0);
    const [isRotated, setIsRotated] = useState(false);
    const[playerId, setPlayerId] = useRecoilState(playerIdState);
    useEffect(() => {
        const newPlayerId = uuidv4(); // Your logic to generate playerId
        setPlayerId(newPlayerId);
    }, []);

    const initialReservedCells: CellArray[] = [];
    for (let i = 0; i < width / 55; i++) {
        initialReservedCells.push([i, 0]);
    }

    const [cellsReserved, setCellsReserved] = useRecoilState<ShipCells[]>(cellReservationState)
    const shipReservation = useRecoilValue(cellReservationState)
    const shootedCell = useRecoilValue<ShootedCell>(cellShootedState)


    useEffect(() => {
        console.log('ship reservation')
        console.log(shipReservation)
    }, [shipReservation])

    useEffect(() => {
        const initialReservedCells: number[][] = [];
        for (let i = 0; i < width / 55; i++) {
            initialReservedCells.push([i, 0]);
        }    
        setCellsReserved([
            ...cellsReserved,
            {
              id: id,
              cells: initialReservedCells,
              count: initialReservedCells.length,
            }
          ])
    }, []);

    useEffect(() => {
        socket.on('shootResult', (data) => {
            const updatedCellsReserved = shipReservation.map((ship) => {

                if (ship.cells.some(cell => cell[0] === data[0] && cell[1] === data[1])) {

                    return { ...ship, count: ship.count - 1 };
                }
                return ship;
            })
            setCellsReserved(updatedCellsReserved)
        })
    }, [shipReservation])

    const boardElement = document.getElementById('board')

    const updateShipCells = (id: string, updatedCells: object) => {
        const updatedCellsReserved = cellsReserved.map((ship) => (ship.id === id ? { ...ship, ...updatedCells } : ship))
        setCellsReserved(updatedCellsReserved)
    }

    const offsetParent = boardElement || undefined
    const handleDrag = (e: any, ui: any) => {
        const { x, y } = ui;
        const translatedX = x / 55;
        const translatedY = y / 55;
        const reservedCells: CellArray[] = [];
        for (let i = 0; i < width / 55; i++) {
            reservedCells.push([translatedX + i, translatedY]);
        }

        const isMoved = cellsReserved.find((ship) => (ship.id === id))
        if (isMoved) {
            const reservedCellsObject = { cells: reservedCells }
            updateShipCells(id, reservedCellsObject)
        }
        else {
            setCellsReserved([...cellsReserved, {
                id: id,
                cells: reservedCells,
                count: reservedCells.length,
            }]);
        }
        console.log(cellsReserved)
    };

    const handleOnclick = () => {
        // console.log('Quay 90 do ne')
        // setIsRotated(!isRotated);
    }
    return (
        <Draggable grid={[55, 55]} bounds="parent" offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: 0, y: 0 }} onStop={handleDrag} >
            <img ref={(element) => drag(element)} src={url} width={width} height={50} style={{ border: "0px" }} alt='board-1' />
        </Draggable>
    )
}

export default Ship