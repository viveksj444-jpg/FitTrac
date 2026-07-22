import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AddMeal from "./pages/AddMeal";
import AddExercise from "./pages/AddExercise";
import WaterTracker from "./pages/WaterTracker";
import Recommendations from "./pages/Recommendations";
import WeeklyAnalytics from "./pages/WeeklyAnalytics";

import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-meal"
          element={
            <ProtectedRoute>
              <AddMeal />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add-exercise"
          element={
            <ProtectedRoute>
              <AddExercise />
            </ProtectedRoute>
          }
        />

        <Route
          path="/water-tracker"
          element={
            <ProtectedRoute>
              <WaterTracker />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <ProtectedRoute>
              <Recommendations />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analytics/weekly"
          element={
            <ProtectedRoute>
              <WeeklyAnalytics />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;