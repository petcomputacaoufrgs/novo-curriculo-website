import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"
import RegrasEquivalenciaView from "./pages/RegrasEquivalenciaView";
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes';
import "./App.css";

function App() {
const [isDark, setIsDark] = useState(false)
  
    useEffect(() => {
      const media = window.matchMedia('(prefers-color-scheme: dark)')
      setIsDark(media.matches)
  
      const listener = (e: MediaQueryListEvent) => setIsDark(e.matches)
      media.addEventListener('change', listener)
  
      return () => media.removeEventListener('change', listener)
    }, [])
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/regras" element={<RegrasEquivalenciaView />}></Route>
      </Routes>
    </Router>
    </ThemeProvider>
  );
}

export default App;
