import { Link } from 'react-router-dom';
import "styles/ui/NavBar.scss";

function NavBar() {
  return (
    <div className="navbar">
      <Link to="/homefeed" className="nav-link">Home Feed</Link>
      <Link to="/mytasks" className="nav-link">My Tasks</Link>
      <Link to="/myapplications" className="nav-link">My Applications</Link>
      <Link to="/myprofile" className="nav-link">My Profile</Link>
    </div>
  );
}

export default NavBar;
