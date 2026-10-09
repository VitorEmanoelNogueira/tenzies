import { useState, useEffect, useRef } from "react"
import { nanoid } from "nanoid";
import Die from "./components/Die"
import Confetti from 'react-confetti'

function App() {

  const [dice, setDice] = useState(() => generateAllNewDice())

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const [announcement, setAnnouncement] = useState( "")

  const buttonRef = useRef(null)

  const gameWon = dice.every(die => die.isHeld && die.value === dice[0].value)

  useEffect(() => {
    function handleResize() {
        setWindowSize({
            width: window.innerWidth,
            height: window.innerHeight
        })
    }

      window.addEventListener("resize", handleResize)

      return () => {
          window.removeEventListener("resize", handleResize)
      }
    }, [])

  useEffect(() => {
    if(gameWon) buttonRef.current.focus()
  }, [gameWon])

  function generateAllNewDice() {
    return new Array(10)
      .fill(0)
      .map(() => ({
        id: nanoid(),
        value: Math.ceil(Math.random() * 6),
        isHeld: false
      }))
  }

  function rollDice() {
    const newDice = gameWon
      ? generateAllNewDice()
      : dice.map(die =>
        die.isHeld
          ? die
          : { ...die, value: Math.ceil(Math.random() * 6) }
      )

    setDice(newDice)
    announceDiceUpdate(newDice)
  }

  function hold(id) {
    setDice(prevDice => prevDice.map(die => die.id === id ? { ...die, isHeld: !die.isHeld } : die))
  }

  function announceDiceUpdate(newDice) {
    setAnnouncement(
      "Dice rolled: " +
      newDice.map(dieObj =>
        `${dieObj.value}, ${dieObj.isHeld ? "Held" : "Not Held"}`
      ).join(", ")
    )
  }
  const diceElements = dice.map(dieObj => <Die key={dieObj.id} value={dieObj.value} isHeld={dieObj.isHeld} hold={() => hold(dieObj.id)} />)

  return (
    <main>
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>

      {gameWon && <Confetti width={windowSize.width} height={windowSize.height}/>}
      <div aria-live="polite" className="sr-only">
        {gameWon && <p>Congratulations! You won! Press "New Game" to start again.</p>}
      </div>
      <h1 className="title">Tenzies</h1>
      <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
      <div className="dice-container">
        {diceElements}
      </div>
      <button className="roll-dice" onClick={rollDice} ref={buttonRef}>{gameWon ? "New Game" : "Roll"}</button>
    </main>
  )
}

export default App