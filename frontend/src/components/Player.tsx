interface PlayerProps {
    name: string;
}

const Player: React.FC<PlayerProps> = (props) => {
    const { name } = props
    return (
        <div>{name}</div>
    )
}

export default Player