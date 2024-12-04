import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import CurrentDate from "./components/CurrentDate";
import GraphWidget from "./components/GraphWidget";
import StockEntryForm from "./components/StockEntryForm";
import WatchListHeader from "./components/WatchListHeader";
import WatchListTable from "./components/WatchListTable";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PortfolioPage from "./pages/PortfolioPage";
import AccountSettingsPage from "./pages/AccountSettingsPage";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen text-white bg-gray-800">
        {/* Navigation Bar */}
        <nav className="fixed top-0 left-0 w-full bg-slate-900 text-white shadow-lg z-10">
          <ul className="flex justify-around py-3">
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/">Login</Link>
            </li>
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/home">Home</Link>
            </li>
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/portfolio">Portfolio</Link>
            </li>
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/account-settings">Account Settings</Link>
            </li>
          </ul>
        </nav>

        {/* Routes for Pages */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
            <Route path="/account-settings" element={<AccountSettingsPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;