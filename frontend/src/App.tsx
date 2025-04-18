import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import TestTransferImages from "./components/TestTransferImages";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/results/:filename" element={<ResultsPage />} />
        <Route path="/test-transfer-images" element={<TestTransferImages></TestTransferImages>}/>
      </Routes>
    </Router>
  );
}

export default App;
