import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
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

// Values exercises
import ValuesCompass from './pages/exercises/ValuesCompass';
import BullsEye from './pages/exercises/BullsEye';
import LifeDomains from './pages/exercises/LifeDomains';
import WhatMatters from './pages/exercises/WhatMatters';
import ValuesInAction from './pages/exercises/ValuesInAction';

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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />

        <Route path="/" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/values" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuesExercise />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/defusion" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <DefusionExercise />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/mindfulness" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <MindfulnessExercise />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/acceptance" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <AcceptanceExercise />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/action" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ActionPlanner />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/hexaflex" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Hexaflex />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/progress" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Progress />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/modules" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Modules />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/coach" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Coach />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/intro-act" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <IntroACT />
            </Layout>
          </ProtectedRoute>
        } />

        <Route path="/exercises/leaves-stream" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <LeavesStream />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Values Exercises */}
        <Route path="/exercises/values-compass" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuesCompass />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/bulls-eye" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <BullsEye />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/life-domains" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <LifeDomains />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/what-matters" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <WhatMatters />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/values-in-action" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuesInAction />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Defusion Exercises */}
        <Route path="/exercises/silly-voice" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <SillyVoice />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/thought-labels" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ThoughtLabels />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/thank-your-mind" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ThankYourMind />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/passengers-on-bus" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <PassengersOnBus />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/clouds-in-sky" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <CloudsInSky />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Mindfulness Exercises */}
        <Route path="/exercises/mindful-walking" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <MindfulWalking />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/eating-meditation" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <EatingMeditation />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/sound-awareness" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <SoundAwareness />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/breath-counting" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <BreathCounting />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/progressive-muscle-relaxation" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ProgressiveMuscleRelaxation />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Acceptance Exercises */}
        <Route path="/exercises/tug-of-war" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <TugOfWar />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/willingness-scale" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <WillingnessScale />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/expansion" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <Expansion />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/emotional-surfing" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <EmotionalSurfing />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/guest-house" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <GuestHouse />
            </Layout>
          </ProtectedRoute>
        } />

        {/* Action Exercises */}
        <Route path="/exercises/smart-goals" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <SMARTGoals />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/barrier-busting" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <BarrierBusting />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/values-based-scheduling" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuesBasedScheduling />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/committed-action-tracker" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <CommittedActionTracker />
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/exercises/valued-living-questionnaire" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuedLivingQuestionnaire />
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
