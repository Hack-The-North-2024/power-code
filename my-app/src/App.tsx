import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./LandingPage";
import GamePage from "./GamePage";
import LoginSignupPage from "./LoginSignupPage";
import { Box, Typography } from "@mui/material";

const App = () => {
  return (
    <Box className="w-[100vw] h-[100vh]">
      <Box className="bg-[#1E3A8A] h-[15vh] flex justify-center items-center">
        <Typography variant="h5" className="text-white">PowerCode</Typography>
      </Box>
      <Box className="h-[70vh]">
        <Router>
          <Routes>
            <Route path="/" element={<LoginSignupPage />} />
            <Route path="/landing/:player" element={<LandingPage />} />
            <Route path="/game/:player/:game" element={<GamePage />} />
          </Routes>
        </Router>
      </Box>
      <Box className="bg-[#1E3A8A] h-[15vh]"></Box>
    </Box>
  );
};

export default App;
