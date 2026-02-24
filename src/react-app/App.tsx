import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import QuizPage from "@/react-app/pages/QuizPage";
import DebugPage from "@/react-app/pages/DebugPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:door" element={<QuizPage />} />
        <Route path="/debug/:door" element={<DebugPage />} />
      </Routes>
    </Router>
  );
}
