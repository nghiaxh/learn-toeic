import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from "./context/ThemeContext";
import { Home } from "./pages/Home";
import { Exam } from "./pages/Exam";
import { Result } from "./pages/Result";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter basename="/learn-toeic">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exam/:section" element={<Exam />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
