import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./pages/StartPage";
import ReviewPage from "./pages/ReviewPage";
// import HistoryPage from "./pages/HistoryPage"; // (nếu có)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartPage />} />
          <Route path="review" element={<ReviewPage />} />
          {/* <Route path="history" element={<HistoryPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
