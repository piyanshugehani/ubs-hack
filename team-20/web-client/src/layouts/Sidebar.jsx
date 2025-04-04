import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from './../../public/assets/img/logo.png'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Sidebar = () => {
  // Routes from the provided data
  const menuData = [
    {
      header: "Volunteer Dashboard",
      items: [
        {
          text: "Dashboard",
          icon: "bx bx-home-circle",
          link: "/",
          available: true
        },
        {
          text: "Live Sessions",
          icon: "bx bx-calendar",
          link: "/sessions",
          available: true
        },
        {
          text: "Past Sessions",
          icon: "bx bx-calendar",
          link: "/past-sessions",
          available: true
        },
        {
          text: "LeaderBoards",
          icon: "bx bx-chart",
          link: "/progress",
          available: true
        },
        {
          text: "Settings",
          icon: "bx bx-cog",
          link: "/settings",
          available: true
        },
        {
          text: "Find Sessions",
          icon: "bx bx-search",
          link: "/matching",
          available: true
        }
      ]
    }
  ];

  return (
    <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
      <div className="app-brand demo">
        <Link aria-label='Navigate to volunteer dashboard homepage' to="/" className="app-brand-link">
          <span className="app-brand-logo demo">
            <img src="/assets/img/sneat.svg" alt="volunteer-logo" aria-label='Volunteer dashboard logo' />
          </span>
          <span className="app-brand-text demo fw-bold ms-2">Welcome</span>
        </Link>

        <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
          <i className="bx bx-chevron-left bx-sm align-middle"></i>
        </a>
      </div>

      <Link aria-label='Navigate to volunteer dashboard homepage' to="/" >
        <DotLottieReact
      src="https://lottie.host/e9a0b7ea-5116-4cc4-bd5a-de215771b7ff/QmGZye8k25.lottie"
      loop
      autoplay
    />
        </Link>

      <div className="menu-inner-shadow"></div>

      <ul className="menu-inner py-1">
        {menuData.map((section) => (
          <React.Fragment key={section.header}>
            {section.header && (
              <li className="menu-header small text-uppercase">
                <span className="menu-header-text">{section.header}</span>
              </li>
            )}
            {section.items.map(MenuItem)}
          </React.Fragment>
        ))}
      </ul>
    </aside>
  );
};

const MenuItem = (item) => {
  const location = useLocation();
  const isActive = location.pathname === item.link;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isSubmenuActive = hasSubmenu && item.submenu.some(subitem => location.pathname === subitem.link);
  
  // Check if path starts with the item link for session details route
  const isSessionDetails = item.link === "/sessions" && location.pathname.startsWith("/sessions/");

  return (
    <li key={item.text} className={`menu-item ${isActive || isSubmenuActive || isSessionDetails ? 'active' : ''} ${hasSubmenu && isSubmenuActive ? 'open' : ''}`}>
      <NavLink
        aria-label={`Navigate to ${item.text} ${!item.available ? 'Pro' : ''}`}
        to={item.link}
        className={`menu-link ${item.submenu ? 'menu-toggle' : ''}`}
        target={item.link.includes('http') ? '_blank' : undefined}
      >
        <i className={`menu-icon tf-icons ${item.icon}`}></i>
        <div>{item.text}</div> {item.available === false && (
          <div className="badge bg-label-primary fs-tiny rounded-pill ms-auto">Pro</div>
        )}
      </NavLink>
      {item.submenu && (
        <ul className="menu-sub">{item.submenu.map(MenuItem)}</ul>
      )}
    </li>
  );
};

export default Sidebar;