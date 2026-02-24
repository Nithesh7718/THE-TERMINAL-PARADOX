import { BrowserRouter as Router, Routes, Route } from "react-router";
import { Toaster } from "sonner";
import HomePage from "@/react-app/pages/Home";
import QuizPage from "@/react-app/pages/QuizPage";
import DebugPage from "@/react-app/pages/DebugPage";
import CodingPage from "@/react-app/pages/CodingPage";
import LeaderboardPage from "@/react-app/pages/Leaderboard";
import NotFound from "@/react-app/pages/NotFound";
import AdminLogin from "@/react-app/pages/admin/AdminLogin";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import AdminUsers from "@/react-app/pages/admin/AdminUsers";
import AdminLeaderboard from "@/react-app/pages/admin/AdminLeaderboard";

export default function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-right" richColors closeButton />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/quiz/:door" element={<QuizPage />} />
        <Route path="/debug/:door" element={<DebugPage />} />
        <Route path="/coding/:door" element={<CodingPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

