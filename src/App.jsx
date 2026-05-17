import { useEffect } from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Report from "./pages/Report";
import Navbar from "./components/Navbar";
import { Toaster } from "@/components/ui/sonner";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("stackaudit-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}