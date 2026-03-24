import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Progress from './pages/Progress';
import Modules from './pages/Modules';
import Coach from './pages/Coach';
import ValuesExercise from './pages/exercises/ValuesExercise';
import DefusionExercise from './pages/exercises/DefusionExercise';
import MindfulnessExercise from './pages/exercises/MindfulnessExercise';
import AcceptanceExercise from './pages/exercises/AcceptanceExercise';
import ActionPlanner from './pages/exercises/ActionPlanner';
import IntroACT from './pages/exercises/IntroACT';
import LeavesStream from './pages/exercises/LeavesStream';
import Hexaflex from './pages/Hexaflex';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import NotFound from './pages/NotFound';
import ObserverSelfJourney from './pages/exercises/ObserverSelfJourney';

// Values exercises
import ValuesCompass from './pages/exercises/ValuesCompass';
import BullsEye from './pages/exercises/BullsEye';
import LifeDomains from './pages/exercises/LifeDomains';
import WhatMatters from './pages/exercises/WhatMatters';
import ValuesInAction from './pages/exercises/ValuesInAction';
import ValuesDuel from './pages/exercises/ValuesDuel';

// Defusion exercises
import SillyVoice from './pages/exercises/SillyVoice';
import ThoughtLabels from './pages/exercises/ThoughtLabels';
import ThankYourMind from './pages/exercises/ThankYourMind';
import PassengersOnBus from './pages/exercises/PassengersOnBus';
import CloudsInSky from './pages/exercises/CloudsInSky';

// Mindfulness exercises
import MindfulWalking from './pages/exercises/MindfulWalking';
import EatingMeditation from './pages/exercises/EatingMeditation';
import SoundAwareness from './pages/exercises/SoundAwareness';
import BreathCounting from './pages/exercises/BreathCounting';
import ProgressiveMuscleRelaxation from './pages/exercises/ProgressiveMuscleRelaxation';

// Acceptance exercises
import TugOfWar from './pages/exercises/TugOfWar';
import WillingnessScale from './pages/exercises/WillingnessScale';
import Expansion from './pages/exercises/Expansion';
import EmotionalSurfing from './pages/exercises/EmotionalSurfing';
import GuestHouse from './pages/exercises/GuestHouse';

// Action exercises
import SMARTGoals from './pages/exercises/SMARTGoals';
import BarrierBusting from './pages/exercises/BarrierBusting';
import ValuesBasedScheduling from './pages/exercises/ValuesBasedScheduling';
import CommittedActionTracker from './pages/exercises/CommittedActionTracker';
import ValuedLivingQuestionnaire from './pages/exercises/ValuedLivingQuestionnaire';

// Improvement #22: Use AuthContext instead of prop drilling
// Improvement #25: Reduce route boilerplate with layout route
function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function ProtectedLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with shared layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hexaflex" element={<Hexaflex />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/modules" element={<Modules />} />
            <Route path="/coach" element={<Coach />} />

            {/* Category overview exercises */}
            <Route path="/exercises/values" element={<ValuesExercise />} />
            <Route path="/exercises/defusion" element={<DefusionExercise />} />
            <Route path="/exercises/mindfulness" element={<MindfulnessExercise />} />
            <Route path="/exercises/acceptance" element={<AcceptanceExercise />} />
            <Route path="/exercises/action" element={<ActionPlanner />} />
            <Route path="/exercises/intro-act" element={<IntroACT />} />

            {/* Self-as-Context */}
            <Route path="/exercises/observer-self" element={<ObserverSelfJourney />} />
            <Route path="/exercises/leaves-stream" element={<LeavesStream />} />

            {/* Values Exercises */}
            <Route path="/exercises/values-compass" element={<ValuesCompass />} />
            <Route path="/exercises/bulls-eye" element={<BullsEye />} />
            <Route path="/exercises/life-domains" element={<LifeDomains />} />
            <Route path="/exercises/what-matters" element={<WhatMatters />} />
            <Route path="/exercises/values-in-action" element={<ValuesInAction />} />
            <Route path="/exercises/values-duel" element={<ValuesDuel />} />

            {/* Defusion Exercises */}
            <Route path="/exercises/silly-voice" element={<SillyVoice />} />
            <Route path="/exercises/thought-labels" element={<ThoughtLabels />} />
            <Route path="/exercises/thank-your-mind" element={<ThankYourMind />} />
            <Route path="/exercises/passengers-on-bus" element={<PassengersOnBus />} />
            <Route path="/exercises/clouds-in-sky" element={<CloudsInSky />} />

            {/* Mindfulness Exercises */}
            <Route path="/exercises/mindful-walking" element={<MindfulWalking />} />
            <Route path="/exercises/eating-meditation" element={<EatingMeditation />} />
            <Route path="/exercises/sound-awareness" element={<SoundAwareness />} />
            <Route path="/exercises/breath-counting" element={<BreathCounting />} />
            <Route path="/exercises/progressive-muscle-relaxation" element={<ProgressiveMuscleRelaxation />} />

            {/* Acceptance Exercises */}
            <Route path="/exercises/tug-of-war" element={<TugOfWar />} />
            <Route path="/exercises/willingness-scale" element={<WillingnessScale />} />
            <Route path="/exercises/expansion" element={<Expansion />} />
            <Route path="/exercises/emotional-surfing" element={<EmotionalSurfing />} />
            <Route path="/exercises/guest-house" element={<GuestHouse />} />

            {/* Action Exercises */}
            <Route path="/exercises/smart-goals" element={<SMARTGoals />} />
            <Route path="/exercises/barrier-busting" element={<BarrierBusting />} />
            <Route path="/exercises/values-based-scheduling" element={<ValuesBasedScheduling />} />
            <Route path="/exercises/committed-action-tracker" element={<CommittedActionTracker />} />
            <Route path="/exercises/valued-living-questionnaire" element={<ValuedLivingQuestionnaire />} />
          </Route>
        </Route>

        {/* Improvement #12: 404 catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
