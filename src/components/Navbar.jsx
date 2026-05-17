import { Link } from "react-router";
import { PackageSearch } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-accent transition-colors hover:text-accent/80">
          <PackageSearch className="w-6 h-6 text-[#FF6B35]" />
          <span className="font-bold text-lg tracking-tight text-[#FF6B35]">StackAudit</span>
        </Link>
      </div>
    </nav>
  );
}