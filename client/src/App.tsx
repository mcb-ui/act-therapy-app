import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ValuesExercise from './pages/exercises/ValuesExercise'
import DefusionExercise from './pages/exercises/DefusionExercise'
import MindfulnessExercise from './pages/exercises/MindfulnessExercise'
import AcceptanceExercise from './pages/exercises/AcceptanceExercise'
import ActionPlanner from './pages/exercises/ActionPlanner'
import Hexaflex from './pages/Hexaflex'
import Layout from './components/Layout'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setAuth={setIsAuthenticated} />} />
        <Route path="/register" element={<Register setAuth={setIsAuthenticated} />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/values"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <ValuesExercise />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/defusion"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <DefusionExercise />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/mindfulness"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <MindfulnessExercise />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/acceptance"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <AcceptanceExercise />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/exercises/action"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <ActionPlanner />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hexaflex"
          element={
            <ProtectedRoute>
              <Layout setAuth={setIsAuthenticated}>
                <Hexaflex />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
