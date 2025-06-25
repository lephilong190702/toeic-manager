import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import StartPage from "./pages/StartPage";
import ReviewPage from "./pages/ReviewPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<StartPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
