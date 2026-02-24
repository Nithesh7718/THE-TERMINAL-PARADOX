import { HashRouter as Router, Routes, Route, Navigate, Outlet } from "react-router";
import { Toaster } from "sonner";

// Pages
import Login from "@/react-app/pages/Login";
import WaitingRoom from "@/react-app/pages/WaitingRoom";
import HomePage from "@/react-app/pages/Home";
import QuizPage from "@/react-app/pages/QuizPage";
import DebugPage from "@/react-app/pages/DebugPage";
import CodingPage from "@/react-app/pages/CodingPage";
import NotFound from "@/react-app/pages/NotFound";

// Admin pages
import AdminLogin from "@/react-app/pages/admin/AdminLogin";
import AdminLayout from "@/react-app/pages/admin/AdminLayout";
import AdminDashboard from "@/react-app/pages/admin/AdminDashboard";
import AdminUsers from "@/react-app/pages/admin/AdminUsers";
import AdminLeaderboard from "@/react-app/pages/admin/AdminLeaderboard";

// Auth helpers
import { getUserSession } from "@/react-app/pages/Login";
import { getSession as getAdminSession } from "@/react-app/lib/adminAuth";
import { isGameStarted } from "@/react-app/lib/gameState";

// ── Guards ─────────────────────────────────────────────────────────────────

/** Redirect to /login if participant session is missing */
function RequireUser() {
  const session = getUserSession();
  if (!session) return <Navigate to="/login" replace />;
  return <Outlet />;
}

/** Redirect to /waiting if game hasn't started yet */
function RequireGameStarted() {
  const session = getUserSession();
  if (!session) return <Navigate to="/login" replace />;
  if (!isGameStarted()) return <Navigate to="/waiting" replace />;
  return <Outlet />;
}

/** Redirect to /login if already authenticated (avoids re-login) */
function RedirectIfLoggedIn() {
  const userSession = getUserSession();
  const adminSession = getAdminSession();
  if (adminSession) return <Navigate to="/admin/dashboard" replace />;
  if (userSession) {
    return isGameStarted()
      ? <Navigate to="/home" replace />
      : <Navigate to="/waiting" replace />;
  }
  return <Outlet />;
}

export default function App() {
  return (
    <Router>
      <Toaster theme="dark" position="top-right" richColors closeButton />
      <Routes>
        {/* Root always redirects to /login  */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth gate: if already logged in, skip login */}
        <Route element={<RedirectIfLoggedIn />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Admin login (separate, no redirect guard needed) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Waiting room: requires participant session */}
        <Route element={<RequireUser />}>
          <Route path="/waiting" element={<WaitingRoom />} />
        </Route>

        {/* Game pages: requires participant session + game started */}
        <Route element={<RequireGameStarted />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/quiz/:door" element={<QuizPage />} />
          <Route path="/debug/:door" element={<DebugPage />} />
          <Route path="/coding/:door" element={<CodingPage />} />
        </Route>

        {/* Admin panel (AdminLayout handles its own session check) */}
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
