import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage"
import RegrasEquivalenciaView from "./pages/RegrasEquivalenciaView/RegrasEquivalenciaView";
import FAQ from "./pages/FAQ/FAQ";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/regras" element={<RegrasEquivalenciaView />}></Route>
        <Route path="/faq" element={<FAQ />} ></Route>
      </Routes>
    </Router>
  );
}

export default App;
