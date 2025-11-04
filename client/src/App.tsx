import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect, lazy, Suspense } from 'react';
import Layout from './components/Layout';

// Eager load auth pages for faster initial load
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load main pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Progress = lazy(() => import('./pages/Progress'));
const Modules = lazy(() => import('./pages/Modules'));
const Coach = lazy(() => import('./pages/Coach'));
const Hexaflex = lazy(() => import('./pages/Hexaflex'));

// Lazy load core exercises
const ValuesExercise = lazy(() => import('./pages/exercises/ValuesExercise'));
const DefusionExercise = lazy(() => import('./pages/exercises/DefusionExercise'));
const MindfulnessExercise = lazy(() => import('./pages/exercises/MindfulnessExercise'));
const AcceptanceExercise = lazy(() => import('./pages/exercises/AcceptanceExercise'));
const ActionPlanner = lazy(() => import('./pages/exercises/ActionPlanner'));
const IntroACT = lazy(() => import('./pages/exercises/IntroACT'));
const LeavesStream = lazy(() => import('./pages/exercises/LeavesStream'));

// Values exercises
const ValuesCompass = lazy(() => import('./pages/exercises/ValuesCompass'));
const BullsEye = lazy(() => import('./pages/exercises/BullsEye'));
const LifeDomains = lazy(() => import('./pages/exercises/LifeDomains'));
const WhatMatters = lazy(() => import('./pages/exercises/WhatMatters'));
const ValuesInAction = lazy(() => import('./pages/exercises/ValuesInAction'));
const ValuesDuel = lazy(() => import('./pages/exercises/ValuesDuel'));

// Defusion exercises
const SillyVoice = lazy(() => import('./pages/exercises/SillyVoice'));
const ThoughtLabels = lazy(() => import('./pages/exercises/ThoughtLabels'));
const ThankYourMind = lazy(() => import('./pages/exercises/ThankYourMind'));
const PassengersOnBus = lazy(() => import('./pages/exercises/PassengersOnBus'));
const CloudsInSky = lazy(() => import('./pages/exercises/CloudsInSky'));

// Mindfulness exercises
const MindfulWalking = lazy(() => import('./pages/exercises/MindfulWalking'));
const EatingMeditation = lazy(() => import('./pages/exercises/EatingMeditation'));
const SoundAwareness = lazy(() => import('./pages/exercises/SoundAwareness'));
const BreathCounting = lazy(() => import('./pages/exercises/BreathCounting'));
const ProgressiveMuscleRelaxation = lazy(() => import('./pages/exercises/ProgressiveMuscleRelaxation'));

// Acceptance exercises
const TugOfWar = lazy(() => import('./pages/exercises/TugOfWar'));
const WillingnessScale = lazy(() => import('./pages/exercises/WillingnessScale'));
const Expansion = lazy(() => import('./pages/exercises/Expansion'));
const EmotionalSurfing = lazy(() => import('./pages/exercises/EmotionalSurfing'));
const GuestHouse = lazy(() => import('./pages/exercises/GuestHouse'));

// Action exercises
const SMARTGoals = lazy(() => import('./pages/exercises/SMARTGoals'));
const BarrierBusting = lazy(() => import('./pages/exercises/BarrierBusting'));
const ValuesBasedScheduling = lazy(() => import('./pages/exercises/ValuesBasedScheduling'));
const CommittedActionTracker = lazy(() => import('./pages/exercises/CommittedActionTracker'));
const ValuedLivingQuestionnaire = lazy(() => import('./pages/exercises/ValuedLivingQuestionnaire'));

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
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
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
        <Route path="/exercises/values-duel" element={
          <ProtectedRoute>
            <Layout setAuth={setIsAuthenticated}>
              <ValuesDuel />
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
      </Suspense>
    </Router>
  );
}

export default App;
