import { useState } from 'react'
import './App.css'
import Form from './Components/Form'
import Canvas from './Components/Canvas'

function App() {

  return (
    <div className='w-full h-[90vh] flex flex-col justify-center items-center'>
      {/* <Form/> */}
      <Canvas/>
    </div>
  )
}

export default App
