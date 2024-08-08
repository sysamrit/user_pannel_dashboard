import React, { useState, useEffect, useRef } from "react";
import { FaAngleRight, FaBars, FaRegLightbulb, FaTools } from "react-icons/fa";
import { MdContentPasteSearch, MdOutlineAssignmentInd } from "react-icons/md";
import { NavLink } from 'react-router-dom';
import "../style/sidebar.css";
import { GrSchedules } from "react-icons/gr";

function SideNavbar({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState([]);
  const [openWidth, setOpenWidth] = useState("250px");
  const [closeWidth, setCloseWidth] = useState("50px");
  const sidebarRef = useRef(null);

  const toggle = () => setIsOpen(!isOpen);

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItem = [
    {
      name: "Inspection",
      icon: <MdContentPasteSearch style={{ fontSize: "25px" }} />,
      submenu: [
        { path: "/inspection/inspection_report", name: "Inspection Report" },
        { path: "inspection/daily_inspection_report", name: "Daily Inspection" },
        { path: "inspection/inspection_transfer", name: "Inspection Transfer" },
        // { path: "/inspection/rca", name: "RCA" },
      ],
    },
    {
      name: "Maintenance",
      icon: <FaTools  style={{fontSize:"20px"}} />,
      submenu: [
        { path: "/maintenance/request_maintenance", name: "Reguest maintenance" },
        { path: "/maintenance/workorder", name: "Workorder" },
        { path: "/maintenance/request_part", name: "Request Part" },
        { path: "/maintenance/reservation", name: "Reservation" },
      ],
    },
    {
      name: "Schedules",
      icon: <GrSchedules style={{fontSize:"22px"}} />,
      path: "/schedules"
    },
    {
      name: "Assign Works",
      icon: <MdOutlineAssignmentInd style={{fontSize:"25px"}} />,
      submenu: [
        { path: "/assign/workdetails", name: "Work Details" },
       
      ],
    },
    {
      name: "RCA",
      icon: <FaRegLightbulb style={{fontSize:"25px"}} />,
      submenu: [
        { path: "/inspection/rca", name: "RCA" },
       
      ],
    },
  ];

  const handleMenuClick = (index) => {
    if (activeMenu.includes(index)) {
      setActiveMenu(activeMenu.filter((i) => i !== index));
    } else {
      setActiveMenu([...activeMenu, index]);
    }
  };

  return (
    <div className="main-container">
      <div
        className="sidebar"
        style={{ width: isOpen ? openWidth : closeWidth }}
        ref={sidebarRef}
      >
        <div className="top_section">
          <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
            AIMS
          </h1>
          <div style={{ marginLeft: isOpen ? "110px" : "0" }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <div>
          {menuItem.map((item, index) => (
            <div key={index}>
              <div className="link" onClick={() => handleMenuClick(index)}>
              <NavLink to={item.path || '#'} className="link" activeClassName="active">

                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? 'flex' : 'none' }} className="link_text">
                  {item.name}
                  {item.submenu && (
                    <FaAngleRight
                      className="dropdown_icon"
                      style={{
                        marginLeft: "10px",
                        transform: activeMenu.includes(index) ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    />
                  )}
                </div>
                </NavLink>
              </div>
              {isOpen && item.submenu && activeMenu.includes(index) && (
                <div className="submenu">
                  {item.submenu.map((subitem, subindex) => (
                    <NavLink to={subitem.path} key={subindex} className="link" activeClassName="active">
                      <div style={{ marginLeft: '30px' }} className="link_text">
                        {subitem.name}
                      </div>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <main>{children}</main>
    </div>
  );
}

export default SideNavbar;
