import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import './revolutionary-quantum.css'
import RevolutionaryQuantumSystem from './RevolutionaryQuantumSystem.tsx'

const MainApp: React.FC = () => {
  return <RevolutionaryQuantumSystem />;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MainApp />
  </React.StrictMode>,
)