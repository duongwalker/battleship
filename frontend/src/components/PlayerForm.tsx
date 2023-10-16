import React, { ChangeEvent } from 'react';

interface PlayerFormProps {
  name: string;
  handleNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}
const PlayerForm: React.FC<PlayerFormProps> = (props) => {
  const { name, handleNameChange,onSubmit } = props
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={name} onChange={handleNameChange} />
        <button type="submit" >add</button>
      </div>
    </form>
  )
}

export default PlayerForm