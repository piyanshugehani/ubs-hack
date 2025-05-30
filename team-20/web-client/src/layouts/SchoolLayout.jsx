/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import Sidebar from './SchoolSidebar';
import Navbar from './Navbar';
import Footer from './Footer';

const SchoolLayout = ({ children }) => {
  useEffect(() => {
    Main();
  },[])
  
  return (
    <div className="layout-wrapper layout-content-navbar">
      <div className="layout-container">
        <Sidebar />
        <div className="layout-page ">
          <div className="content-wrapper">
            <div className="container-xxl flex-grow-1 container-p-y">
            {children}
            </div>
            <Footer />
          </div>
        </div>
      <div className="layout-overlay layout-menu-toggle"></div>
      </div>
    </div>
  );
};

export default SchoolLayout;
