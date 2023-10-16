import Ship from './Ship';
import Board from './Board';
import './Board.css'

const DragDrop = () => {
  // const shipList: Ship[] = [
  //   { id: 'ship2', name: 'Ship 2', img: '/boat-2.png', width: 500, height: 50, x: 0, y: 0 },
  //   { id: 'ship1', name: 'Ship 1', img: '/boat.png', width: 500, height: 50, x:55, y: 0 },
  //   { id: 'ship3', name: 'Ship 3', img: '/boat-3.jpg', width: 500, height: 50, x: 0, y: 0 },
  //   // Add more ship data as needed
  // ];

  // interface Ship {
  //   id: string;
  //   name: string;
  //   img: any;
  //   width: any;
  //   height: any;
  //   x: number
  //   y: number
  // }



  return (
    <div className='container'>
      {/* <div className='Ships'>
        {shipList.map((ship) => {
          return <Ship id={ship.id} url={ship.img} width={ship.width} height={ship.height} x={ship.x} y={ship.y}/>
        })}
      </div> */}
      <div className='Board'>
        <Board />

      </div>
    </div>

  );
};

export default DragDrop;
