import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QuizProvider } from './QuizContext';
import { Background } from './components/Background';
import { LogoHeader } from './components/LogoHeader';
import { LandingPage } from './pages/LandingPage';
import { RegistrationPage } from './pages/RegistrationPage';
import { QuizPage } from './pages/QuizPage';
import { ResultPage } from './pages/ResultPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { AdminPage } from './pages/AdminPage';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="relative min-h-screen flex flex-col selection:bg-[#D4AF37] selection:text-black bg-[#090D18]">
      {/* Background layer */}
      <Background />

      {/* Subpage Header (only shown on subpages) */}
      {!isHome && <LogoHeader />}
      
      {/* Main Content Area */}
      <main className={isHome ? "flex-grow w-full relative z-10" : "flex-grow container mx-auto px-4 py-8 relative z-10"}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* Subpage Footer */}
      {!isHome && (
        <footer className="py-8 text-center text-slate-400 text-xs border-t border-white/5 relative z-10 bg-[#05080E]/70 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 space-y-2">
            <p className="font-cinzel text-xs text-[#F3C74C]">VIPLAVA 2026 · The Wisdom Quest</p>
            <p className="text-[11px] text-slate-400">Gokul Dham, Mathura · ISKCON - North Wing & EthicCraft Club</p>
            <p className="text-[10px] text-slate-400">Dedicated to His Divine Grace A.C. Bhaktivedanta Swami Prabhupada</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Router>
          <AppContent />
        </Router>
      </QuizProvider>
    </ErrorBoundary>
  );
}
