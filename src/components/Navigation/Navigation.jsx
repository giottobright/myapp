import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-logo">Наша История Любви</div>
      <div className="nav-links">
        <Link to="/">Фотоальбом</Link>
        <Link to="/calendar">Календарь</Link>
      </div>
    </nav>
  );
}

export default Navigation;