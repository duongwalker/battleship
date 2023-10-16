import { useState } from "react"
import Ship from './Ship';
import { useDrop } from 'react-dnd';
import './Board.css'

interface CellProps {
    value: String;
    children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ value }) => {
    const [reserved, setReserved] = useState(false)
    const handleClicking = () => {
        setReserved(true)
    }

    // const [{ isOver }, drop] = useDrop(() => ({
    //     accept: "ship",
    //     drop: (item: any) => addShipToBoard(item.id),
    //     collect: (monitor) => ({
    //         isOver: !!monitor.isOver(),
    //     })
    // }))

    // const addShipToBoard = (id: any) => {
    //     const ship = shipList.find((ship) => id === ship.id)
    //     if (ship) {
    //         ship.width = 320
    //         ship.height = 50
    //         setBoard(ship)
    //     }
    // }
    return (
        <div onClick={handleClicking} className="cell">
            {/* {board && <Ship id={board.id} url={board.img} height={board.height} width={board.width} />} */}
        </div>
    )
}

export default Cell