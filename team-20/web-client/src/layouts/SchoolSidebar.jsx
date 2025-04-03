import { Link, NavLink, useLocation } from 'react-router-dom';
import menuData from '../data/menuData.json'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import React from 'react';

const StudentSidebar = () => {
    return (
        <aside id="layout-menu" className="layout-menu menu-vertical menu bg-menu-theme">
            <div className="app-brand demo">
                <Link aria-label='Navigate to sneat homepage' to="/" className="app-brand-link">
                    <span className="app-brand-logo demo">
                        {/* Increased size of the image with width and height attributes */}
                        <img 
                            src="/assets/img/sneat.svg" 
                            alt="sneat-logo" 
                            aria-label='Sneat logo image'
                            style={{ width: '40px', height: 'auto' }} // Increased size here
                        />
                    </span>
                    <span className="app-brand-text demo menu-text fw-bold ms-2">Sneat</span>
                </Link>
                <a href="#" className="layout-menu-toggle menu-link text-large ms-auto d-block d-xl-none">
                    <i className="bx bx-chevron-left bx-sm align-middle"></i>
                </a>
            </div>
            <Link aria-label='Navigate to volunteer dashboard homepage' to="/" >
                {/* Increased size of the lottie animation by adding style with width property */}
                <DotLottieReact
                    src="https://lottie.host/e9a0b7ea-5116-4cc4-bd5a-de215771b7ff/QmGZye8k25.lottie"
                    loop
                    autoplay
                    style={{ width: '100%', maxWidth: '250px', margin: '0 auto' }} // Increased size here
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

export default StudentSidebar;