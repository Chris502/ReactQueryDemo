import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'
import { PokeTable } from './Components/PokemonTable'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <PokeTable />
    </>
  )
}

export default App
