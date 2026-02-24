import { BrowserRouter as Router, Routes, Route } from "react-router";
import HomePage from "@/react-app/pages/Home";
import QuizPage from "@/react-app/pages/QuizPage";
import DebugPage from "@/react-app/pages/DebugPage";
import CodingPage from "@/react-app/pages/CodingPage";
import LeaderboardPage from "@/react-app/pages/Leaderboard";
import NotFound from "@/react-app/pages/NotFound";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:door" element={<QuizPage />} />
        <Route path="/debug/:door" element={<DebugPage />} />
        <Route path="/coding/:door" element={<CodingPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
