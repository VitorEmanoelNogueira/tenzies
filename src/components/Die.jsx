export default function Die(props){
    return(
        <button 
        className= {`die ${props.isHeld && 'is-held'}`} 
        onClick={props.hold}
        aria-pressed={props.isHeld}
        aria-label={`Die with value ${props.value}, ${props.isHeld ? "held" : "not held"}`}>
            {props.value}
        </button>
    )
}