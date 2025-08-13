import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import VocabularyList from "./components/VocabularyList";

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <VocabularyList />
    </div>
  );
}

export default App;