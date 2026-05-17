import { useState, useEffect } from "react";
import { Link } from "react-router";
import { PackageSearch, Sun, Moon } from "lucide-react";
import gsap from "gsap";

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem("stackaudit-theme") || "dark");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("stackaudit-theme", newTheme);

    gsap.fromTo(".theme-toggle-icon", 
      { rotation: 0, opacity: 0, scale: 0.5 }, 
      { rotation: 360, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
    );
  };

  return (
    <nav className="border-b border-[var(--border)] bg-[var(--bg-surface)] relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--accent)] transition-colors hover:opacity-80">
          <PackageSearch className="w-6 h-6" />
          <span className="font-bold text-lg tracking-tight">StackAudit</span>
        </Link>

        <button 
          onClick={toggleTheme}
          className="p-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors theme-toggle-btn"
          aria-label="Toggle theme"
        >
          <div className="theme-toggle-icon">
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </div>
        </button>
      </div>
    </nav>
  );
}