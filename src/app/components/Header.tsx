import { Link } from "react-router";
import { Hammer, Settings, LayoutDashboard } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

interface HeaderProps {
  variant?: "default" | "simple";
  title?: string;
  onBack?: () => void;
}

export function Header({ variant = "default", title, onBack }: HeaderProps) {
  if (variant === "simple") {
    return (
      <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="h-full px-4 flex items-center justify-between max-w-[1366px] mx-auto">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && <h1 className="text-lg font-semibold text-[#111827] flex-1 text-center">{title}</h1>}
          <div className="w-10" />
        </div>
      </header>
    );
  }

  return (
    <header className="h-16 bg-white shadow-sm sticky top-0 z-50">
      <div className="h-full px-4 lg:px-24 flex items-center justify-between max-w-[1366px] mx-auto">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-[#17384E] rounded-lg flex items-center justify-center">
            <Hammer className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-[#17384E]">Håndtverkeren</span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/logg-inn"
            className="hidden md:flex items-center justify-center h-10 px-4 text-[#17384E] rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Logg inn
          </Link>
          <Link
            to="/dashboard"
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
            title="Kunde Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
          <Link
            to="/admin"
            className="hidden lg:flex items-center justify-center w-10 h-10 border border-gray-300 text-[#6B7280] rounded-lg hover:bg-gray-50 transition-colors"
            title="Admin Panel"
          >
            <Settings className="w-5 h-5" />
          </Link>
          <Link
            to="/pris"
            className="hidden md:flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 border-[1.5px] border-[#E5E7EB] text-[#111827] rounded-lg font-semibold bg-transparent hover:bg-gray-50 transition-colors"
          >
            Pris
          </Link>
          <Link
            to="/registrer"
            className="hidden sm:flex items-center justify-center h-10 sm:h-12 px-4 sm:px-6 bg-[#E07B3E] text-white rounded-lg font-semibold hover:bg-[#d16f35] transition-colors"
          >
            Bli kunde
          </Link>
          <Link
            to="/leverandør-logg-inn"
            className="hidden sm:flex items-center justify-center h-10 sm:h-12 px-4 sm:px-5 border-[1.5px] border-[#17384E] text-[#17384E] rounded-lg font-semibold bg-transparent hover:bg-[#17384E] hover:text-white transition-colors"
          >
            For leverandører
          </Link>
          <Link
            to="/registrer"
            className="sm:hidden flex items-center justify-center h-10 px-5 bg-[#E07B3E] text-white rounded-lg font-semibold"
          >
            Registrer
          </Link>
          <NotificationBell />
        </div>
      </div>
    </header>
  );
}