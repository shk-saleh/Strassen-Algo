import { useState } from 'react'
import './App.css'
import Form from './Components/Form'
import Canvas from './Components/Canvas'

function App() {

  return (
    <div className='w-full h-[90vh] flex flex-col justify-center items-center'>
      <h1 className='text-2xl pb-10'>Matrix Multiplication Visualizer</h1>
      {/* <Form/> */}
      <Canvas/>
    </div>
  )
}

export default App
