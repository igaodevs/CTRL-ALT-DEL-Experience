import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";

// Import pages
import BootScreen from "./pages/index";
import ExplorationRoom from "./pages/explore";
import ResetScreen from "./pages/reset";

// Import utils
import { soundController } from "./utils/soundController";
import { interactionTracker } from "./utils/interactionTracker";

function App() {
  useEffect(() => {
    // Initialize sound controller and interaction tracker
    soundController.loadSounds();
    interactionTracker.init();
  }, []);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/" element={<BootScreen />} />
          <Route path="/explore" element={<ExplorationRoom />} />
          <Route path="/reset" element={<ResetScreen />} />
          <Route path="/home" element={<Home />} />

          {/* Allow Tempo routes */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
