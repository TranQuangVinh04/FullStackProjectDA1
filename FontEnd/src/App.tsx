import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <h1 className="text-6xl font-bold underline">
      <button className="btn btn-primary" onClick={() => setCount(count + 1)}>Button</button>
    Hello world!{count}
  </h1>
      </div>
    </>
  )
}

export default App
