import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import GamePage from "./GamePage";
import LoginSignupPage from "./LoginSignupPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignupPage />} />
        <Route path="/landing/:player" element={<LandingPage />} />
        <Route path="/game/:code" element={<GamePage />} />
      </Routes>
    </Router>
  );
};

export default App;
