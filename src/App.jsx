import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Navbar from "./components/Navbar";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
}