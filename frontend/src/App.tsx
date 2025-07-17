import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import HomePage from "./pages/HomePage"
import RegrasEquivalenciaView from "./pages/RegrasEquivalenciaView";

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/regras" element={<RegrasEquivalenciaView />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
