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
    isHorizontal: boolean
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
    const [playerId, setPlayerId] = useRecoilState(playerIdState);
    const [isHorizontal, setIsHorizontal] = useState(true)
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
                isHorizontal: isHorizontal
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

    const handleContextMenu = (e: React.MouseEvent) => {
        console.log('Right click')
        e.preventDefault(); // Prevent the default context menu
        setRotationAngle(rotationAngle + 90);
    };

    const offsetParent = boardElement || undefined
    // useEffect(() => {
    //     const isMoved = cellsReserved.find((ship) => ship.id === id);
    //     if (isMoved) {
    //         setIsHorizontal(isMoved.isHorizontal);
    //     }
    // }, [isHorizontal]);

    const handleDrag = (e: any, ui: any) => {
        const { x, y } = ui;
        const translatedX = x / 55;
        const translatedY = y / 55;
        const reservedCells: CellArray[] = [];
        if (e.button === 2) {
            e.preventDefault()
            if (isHorizontal === true) {
                console.log("chuot phai ne")
                setRotationAngle(rotationAngle - 90);
                setIsHorizontal(prevState => !prevState)
                for (let i = 0; i < width / 55; i++) {
                    reservedCells.push([translatedX + width / 55 - 1, translatedY + i]);
                }
            }
            else {
                setRotationAngle(rotationAngle + 90)
                setIsHorizontal(prevState => !prevState)

                for (let i = 0; i < width / 55; i++) {
                    reservedCells.push([translatedX + i, translatedY]);
                }
            }
        }
        else {

            if (isHorizontal === true) {
                for (let i = 0; i < width / 55; i++) {
                    reservedCells.push([translatedX + i, translatedY]);
                }
            }
            else {
                console.log('Dang move trong tinh trang vertical')
                for (let i = 0; i < width / 55; i++) {
                    reservedCells.push([translatedX + i, translatedY + width / 55 - 1]);
                }
            }
        }


        const isMoved = cellsReserved.find((ship) => (ship.id === id))
        if (isMoved) {
            console.log('Day la isMove.isHorizontal')
            console.log(isMoved.isHorizontal)
            const reservedCellsObject = { cells: reservedCells };
            setCellsReserved((prevCellsReserved) => {
                const updatedCellsReserved = prevCellsReserved.map((ship) =>
                    ship.id === id ? { ...ship, ...reservedCellsObject, isHorizontal: isHorizontal } : ship
                );
                return updatedCellsReserved;
            });


        }
        else {
            console.log('day la isHorizontal')
            console.log(isHorizontal)
            setCellsReserved((prevCellsReserved) => [
                ...prevCellsReserved,
                {
                    id: id,
                    cells: reservedCells,
                    count: reservedCells.length,
                    isHorizontal: isHorizontal,
                },
            ]);
        }
        console.log(cellsReserved)
    };

    return (
        // <Draggable grid={[55, 55]} bounds="parent" offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: 0, y: 0 }} onStop={handleDrag} allowAnyClick={true}>
        //     <span>
        //         <img ref={(element) => drag(element)} src={url} width={width} height={50} alt='board-1' style={{ border: "0px", transform: `rotate(${rotationAngle}deg)`, transformOrigin: `${width-27.5}px 27.5px`, transition: 'transform 0.2s' }} />
        //     </span>
        // </Draggable>
        <Draggable grid={[55, 55]} offsetParent={offsetParent} onMouseDown={(e) => e.preventDefault()} positionOffset={{ x: 0, y: 0 }} onStop={handleDrag} allowAnyClick={true}>
            <span ref={(element) => drag(element)} onContextMenu={(e) => e.preventDefault()}>
                <img src={url} width={width} height={50} alt='board-1' style={{ border: "0px", transform: `rotate(${rotationAngle}deg)`, transformOrigin: `${width - 27.5}px 27.5px`, transition: 'transform 0.2s' }} />
            </span>
        </Draggable>

    )
}

export default Ship