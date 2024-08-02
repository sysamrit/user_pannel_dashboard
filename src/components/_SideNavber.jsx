import React, { useState } from 'react';
import { FaAngleRight, FaBars, FaTools, FaPlus, FaWpforms } from 'react-icons/fa';
import { MdContentPasteSearch } from 'react-icons/md';
import { useNavigate, NavLink } from 'react-router-dom';

export const SideNavber = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [openWidth, setOpenWidth] = useState("250px");
  const [closeWidth, setCloseWidth] = useState("50px");

  const toggle = () => setIsOpen(!isOpen);

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };

  const menuItem = [
    {
      name: 'Inspection',
      icon: <MdContentPasteSearch />,
      submenu: [
        { path: '/inspection/inspection_report', name: 'Inspection Report' },
        { path: '/inspection/form', name: 'Inspection Form' },
        { path: '/inspection/rca', name: 'RCA' },
      ],
    },
    {
      name: 'Maintenance',
      icon: <FaTools />,
      submenu: [
        { path: '/maintenance/workorder', name: 'Work Order' },
        { path: '/maintenance/service_schedule', name: 'Service Schedule' },
      ],
    }
  ];

  return (
    <div className="container">
      <div style={{ width: isOpen ? openWidth : closeWidth }} className="sidebar">
        <div className="top_section">
          <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
            Logo
          </h1>
          <div style={{ marginLeft: isOpen ? '110px' : '0' }} className="bars">
            <FaBars onClick={toggle} />
          </div>
        </div>
        <div>
          {menuItem.map((item, index) => (
            <div key={index}>
              <div className="link" onClick={() => handleMenuClick(index)}>
                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? 'flex' : 'none' }} className="link_text">
                  {item.name}
                  {item.submenu && (
                    <FaAngleRight
                      className="dropdown_icon"
                      style={{ marginLeft: "10px",
                        transform: activeMenu === index ? 'rotate(90deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s',
                      }}
                    />
                  )}
                </div>
              </div>
              {isOpen && item.submenu && activeMenu === index && (
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
      <main style={{ marginLeft: isOpen ? '250px' : '50px', transition: 'margin-left 0.5s' }}>{children}</main>
    </div>
  );
};
