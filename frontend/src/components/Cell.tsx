import { useState, useEffect, useContext } from "react"
import Ship from './Ship';
import { useDrop } from 'react-dnd';
import './Board.css'
// import { SocketContext } from '../context/SocketContext';
import socket from "./socket";
import { cellShootedState, playerIdState, cellReservationState } from "./State";
import { useRecoilState, useRecoilValue } from "recoil";

interface CellProps {
    id: any
    value: [number, number];
    children?: React.ReactNode;
    className: string
}

type Cell = [number, number]

interface ShootedCell {
    cell: [number, number],
    playerId: any
}

const Cell: React.FC<CellProps> = ({ id, value, children, className }) => {
    const [reserved, setReserved] = useState(false)
    const [shootCell, setShootCell] = useRecoilState<Cell>(cellShootedState)
    const playerId = useRecoilValue(playerIdState)
    const shipReservation = useRecoilValue(cellReservationState)

    const handleClicking = async () => {
        if (!reserved) {
            setReserved(true);
            console.log('God damnnn')
            await socket.emit('shootEvent', value)
        }
    }

    // useEffect(() => {
    //     socket.on("shootResult", (data) => {
    //         setShootCell(data)
    //     });
    // }, [socket])

    const clickable = className === 'opponentCell';

    return (
        <div id = {id} onClick={clickable ? handleClicking : undefined} className={className} >
            {reserved ? '🔴' : children}
        </div>
    )
}

export default Cell