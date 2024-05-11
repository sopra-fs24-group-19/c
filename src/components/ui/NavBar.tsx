import { Link, useLocation } from 'react-router-dom';
import "styles/ui/NavBar.scss";

function NavBar() {
  const location = useLocation();
  return (
    <div className="navbar">
      <Link to="/homefeed" className={`nav-link ${location.pathname === "/homefeed" ? "active" : ""}`}>Home Feed</Link>
      <Link to="/mytasks" className={`nav-link ${location.pathname === "/mytasks" ? "active" : ""}`}>My Tasks</Link>
      <Link to="/myapplications" className={`nav-link ${location.pathname === "/myapplications" ? "active" : ""}`}>My Applications</Link>
      <Link to="/myprofile" className={`nav-link ${location.pathname === "/myprofile" ? "active" : ""}`}>My Profile</Link>
    </div>
  );
}

export default NavBar;
