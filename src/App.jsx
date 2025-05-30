import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from './lib/react/React'
import { useState, useEffect } from './lib/react/ReactHooks'

function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    console.log('change');
    return () => {console.log('clean')}
  }, [count])

  return (
    <div>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + ReactFunctionComponent</h1>
      <div className="card">
        <div>
          <button onClick={() => setCount(count - 1)}>
            -
          </button>
          <span>{count}</span>
          <button onClick={() => setCount(count + 1)}>
            +
          </button>
        </div>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

// class App extends React.Component {
//   constructor(props) {
//     super(props)
//   }

//   render() {
//     return (
//       <div>
//         <div>
//           <a href="https://vite.dev" target="_blank">
//             <img src={viteLogo} className="logo" alt="Vite logo" />
//           </a>
//           <a href="https://react.dev" target="_blank">
//             <img src={reactLogo} className="logo react" alt="React logo" />
//           </a>
//         </div>
//         <h1>Vite + ReactClassComponent</h1>
//         <div className="card">
//           <p>
//             Edit <code>src/App.jsx</code> and save to test HMR
//           </p>
//         </div>
//         <p className="read-the-docs">
//           Click on the Vite and React logos to learn more
//         </p>
//       </div>
//     )
//   }
// }

export default App
