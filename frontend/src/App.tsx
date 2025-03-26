import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import Test from "./components/Test";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results/:filename" element={<ResultsPage />} />
        <Route path="/test" element={<Test></Test>} />
        
      </Routes>
    </Router>
  );
}

export default App;
