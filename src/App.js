import React, { useState, useEffect, Suspense, lazy } from "react";
import "./App.css";
import { Toaster } from "./components/ui/sonner";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AdminPanel from "./components/AdminPanel";

// Carregamento lento de componentes pesados
const About = lazy(() => import("./components/About"));
const Portfolio = lazy(() => import("./components/Portfolio"));
const ContactForm = lazy(() => import("./components/ContactForm"));
const MapSection = lazy(() => import("./components/MapSection"));
const Footer = lazy(() => import("./components/Footer"));

function App() {
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('theme-mode', newDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newDarkMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        setAdminPanelOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="App" data-theme={isDarkMode ? 'dark' : 'light'}>
      <Header isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />
      <main>
        <Hero />
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <About />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <Portfolio />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <ContactForm />
        </Suspense>
        <Suspense fallback={<div style={{ minHeight: '400px' }} />}>
          <MapSection />
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </main>
      <Toaster position="top-right" />
      <AdminPanel isOpen={adminPanelOpen} onClose={() => setAdminPanelOpen(false)} />
    </div>
  );
}

export default App;
