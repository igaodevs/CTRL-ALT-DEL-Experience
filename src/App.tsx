import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import { Menubar, MenubarMenu, MenubarContent, MenubarTrigger, LanguageSwitcher } from './components/ui/menubar';
import { useTranslation } from 'react-i18next';

// Import pages
import BootScreen from "./pages/index";
import ExplorationRoom from "./pages/explore";
import ResetScreen from "./pages/reset";
import HackerMapPage from './pages/hackermap';
import NewWorld from "./pages/newworld";

// Import utils
import { soundController } from "./utils/soundController";
import { interactionTracker } from "./utils/interactionTracker";

function App() {
  useEffect(() => {
    // Initialize sound controller and interaction tracker
    soundController.loadSounds();
    interactionTracker.init();
  }, []);

  const { i18n } = useTranslation();

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 100, display: 'flex', justifyContent: 'flex-end', padding: '8px' }}>
          <Menubar className="p-0 bg-transparent border-none shadow-none">
            <MenubarMenu>
              <MenubarTrigger className="px-2 py-1 text-xs font-normal bg-transparent border-none shadow-none hover:bg-transparent focus:bg-transparent">
                <span role="img" aria-label="idioma" style={{ fontSize: '16px', opacity: 0.7 }}>
                  {i18n.language === 'pt-BR' ? 'PT' : 'EN'}
                </span>
              </MenubarTrigger>
              <MenubarContent>
                <LanguageSwitcher />
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div style={{ paddingTop: 48 }}>
          <Routes>
            <Route path="/" element={<BootScreen />} />
            <Route path="/explore" element={<ExplorationRoom />} />
            <Route path="/reset" element={<ResetScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/hackermap" element={<HackerMapPage />} />
            <Route path="/newworld" element={<NewWorld />} />

            {/* Allow Tempo routes */}
            {import.meta.env.VITE_TEMPO === "true" && (
              <Route path="/tempobook/*" />
            )}
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </>
    </Suspense>
  );
}

export default App;
