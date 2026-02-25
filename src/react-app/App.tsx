import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router";
import { Toaster } from "sonner";

// Pages
import Login from "@/react-app/pages/Login";
import WaitingRoom from "@/react-app/pages/WaitingRoom";
import HomePage from "@/react-app/pages/Home";
import QuizPage from "@/react-app/pages/QuizPage";
import DebugPage from "@/react-app/pages/DebugPage";
import CodingPage from "@/react-app/pages/CodingPage";
import NotFound from "@/react-app/pages/NotFound";
import SEBRequired from "@/react-app/pages/SEBRequired";
import ExamGate, { hasPassedEntryGate } from "@/react-app/pages/ExamGate";

// Admin pages
import AdminLogin from "@/react-app/pages/admin/AdminLogin";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import AdminUsers from "@/react-app/pages/admin/AdminUsers";
import AdminLeaderboard from "@/react-app/pages/admin/AdminLeaderboard";
import QuestionBank from "@/react-app/pages/admin/QuestionBank";

// Auth + state helpers
import { getUserSession } from "@/react-app/pages/Login";
import { getSession as getAdminSession } from "@/react-app/lib/adminAuth";
import { subscribeToGameState } from "@/react-app/lib/gameState";
import { isInSEB } from "@/react-app/lib/sebDetection";

// ── Guards ─────────────────────────────────────────────────────────────────

/** Block access unless user is inside Safe Exam Browser */
function RequireSEB() {
  if (!isInSEB()) return <SEBRequired />;
  return <Outlet />;
}

/** Requires participant session — syncs game state from Firestore */
function RequireGameStarted() {
  const session = getUserSession();
  const [gameState, setGameState] = useState<any>(null);

  useEffect(() => {
    const unsub = subscribeToGameState(setGameState);
    return unsub;
  }, []);

  if (!session) return <Navigate to="/login" replace />;
  if (gameState === null) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
    </div>
  );
  if (!gameState.started) return <Navigate to="/waiting" replace />;
  // Game is started — check entry gate
  if (!hasPassedEntryGate()) return <Navigate to="/exam-gate" replace />;
  return <Outlet />;
}

/** Require participant session only */
function RequireUser() {
  const session = getUserSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Skip login if already authenticated */
function RedirectIfLoggedIn() {
  const userSession = getUserSession();
  const adminSession = getAdminSession();
  if (adminSession) return <Navigate to="/admin/dashboard" replace />;
  if (userSession) return <Navigate to="/waiting" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-right" richColors closeButton />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Participant routes — Require SEB for everything after login */}
        <Route element={<RequireUser />}>
          <Route element={<RequireSEB />}>
            <Route path="/waiting" element={<WaitingRoom />} />
            <Route path="/exam-gate" element={<ExamGate />} />

            {/* Game pages: requires game started + entry password */}
            <Route element={<RequireGameStarted />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/quiz/:door" element={<QuizPage />} />
              <Route path="/debug/:door" element={<DebugPage />} />
              <Route path="/coding/:door" element={<CodingPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="leaderboard" element={<AdminLeaderboard />} />
          <Route path="questions" element={<QuestionBank />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
