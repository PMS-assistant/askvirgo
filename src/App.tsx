import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useMountAnimation } from './lib/motion';
import AnnouncementBanner from './components/home/AnnouncementBanner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import HomePage from './pages/HomePage';
import CompanyPage from './pages/CompanyPage';
import GigSearchPage from './pages/GigSearchPage';
import ConsultingPage from './pages/ConsultingPage';

function App() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > window.innerHeight);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const { ref: scrollTopRef, shouldRender: showScrollTopButton } =
    useMountAnimation<HTMLButtonElement>(showScrollTop);

  return (
    <Router>
      {/* overflow-x-clip, not -hidden: `hidden` computes overflow-y to `auto`,
          making this a scroll container and breaking `position: sticky` for
          every descendant (CapabilityScroller pins). `clip` clips the same
          horizontal overflow without creating one. */}
      <div className="min-h-screen overflow-x-clip" style={{ background: 'var(--ground)', color: 'var(--ink)' }}>
        <ScrollToTop />
        <AnnouncementBanner />
        <Navbar />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vzir" element={<Navigate to="/" replace />} />
          <Route path="/company" element={<CompanyPage />} />
          <Route path="/thegigsearch" element={<GigSearchPage />} />
          <Route path="/consulting" element={<ConsultingPage />} />
        </Routes>

        <Footer />

        {showScrollTopButton && (
          <button
            ref={scrollTopRef}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="fixed bottom-8 left-8 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--line)',
              boxShadow: '0 10px 30px rgba(20,18,26,0.12)',
            }}
          >
            <ArrowUp className="w-5 h-5" style={{ color: 'var(--primary)' }} />
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;
