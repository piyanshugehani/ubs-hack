import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import menuData from '../data/studentmenu.json';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const Sidebar2 = () => {
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">

            <div className="app-brand demo">
                <Link aria-label="Navigate to sneat homepage" to="/" className="app-brand-link">
                    <span className="app-brand-logo demo">
                        <img src="/assets/img/sneat.svg" alt="sneat-logo" aria-label="Sneat logo image" />
                    </span>
                    <span className="app-brand-text demo menu-text fw-bold ms-2">gyansarthi.ai</span>
                </Link>

                <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>

            <div className="sidebar-gif-container text-center p-2">
                {/* <img src="../public/assets/img/students.png" alt="Sidebar Animation" className="sidebar-gif" style={{ width: '80%', height: 'auto', borderRadius: '8px' }} /> */}
                <DotLottieReact
                src="https://lottie.host/e9a0b7ea-5116-4cc4-bd5a-de215771b7ff/QmGZye8k25.lottie"
                loop
                autoplay
                />
            </div>

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

    return (
        <li className={`menu-item ${isActive || isSubmenuActive ? 'active' : ''} ${hasSubmenu && isSubmenuActive ? 'open' : ''}`}>
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

export default Sidebar2;
