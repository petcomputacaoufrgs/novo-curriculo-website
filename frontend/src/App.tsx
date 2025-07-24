import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"
import RegrasEquivalenciaView from "./pages/RegrasEquivalenciaView";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/regras" element={<RegrasEquivalenciaView />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
