import { atom, useRecoilState } from 'recoil';

interface ShipCells {
  id: string,
  cells: number[][],
  count: number,
  isHorizontal: boolean
}

// interface ShootedCell {
//   cell: [number, number],
//   playerId: string
// }
type ShootedCell = [number, number]
export const cellReservationState = atom<ShipCells[]>({
  key: 'cellReservationState',
  default: []
})

export const cellShootedState = atom<ShootedCell>({
  key: 'cellShootedState',
  default: [0,0]
})

export const playerIdState = atom<string | null>({
  key: 'playerIdState',
  default: null,
})