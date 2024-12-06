import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
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
              <Link to="https://us-east-1nrudtzebf.auth.us-east-1.amazoncognito.com/login/continue?client_id=7r5jb6cmr2pl3e7cujc6f2ome2&redirect_uri=https%3A%2F%2Fwww.simplystock.net%2F&response_type=code&scope=email+openid+phone">Login</Link>
            </li>
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/home">Home</Link>
            </li>
            <li className="hover:text-violet-500 cursor-pointer">
              <Link to="/portfolio">Stock Comparison and Data</Link>
            </li>
          </ul>
        </nav>

        {/* Routes for Pages */}
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/portfolio" element={<PortfolioPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;