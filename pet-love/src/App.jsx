import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PetLove from './components/PetLove/PetLove'

function App() {
  const [count, setCount] = useState(0)

  return (
    <PetLove></PetLove>
  )
}

export default App
