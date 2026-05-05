import React from 'react';
import { ActiveTab, User } from '../../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentUser: User | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, currentUser, onLogout }) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'purchases', label: 'Purchases', icon: '📋' },
    { id: 'sales', label: 'Sales', icon: '💰' },
    { id: 'customers', label: 'Customers', icon: '👥' },
    { id: 'vendors', label: 'Vendors', icon: '🏭' },
    { id: 'reports', label: 'Reports', icon: '📊' }
  ];

  return (
    <header className="site-header">
      <div className="container">
        <div className="header-wrapper">
          <div className="logo">
            <span className="logo-icon">📦</span>
            <span className="logo-text">Inventory Tracker</span>
          </div>
          
          <nav className="main-nav">
            <ul className="nav-links">
              {tabs.map(tab => (
                <li key={tab.id}>
                  <button
                    className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className="nav-icon">{tab.icon}</span>
                    <span className="nav-label">{tab.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="user-section">
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{currentUser?.fullName}</span>
              <span className="user-role">{currentUser?.role}</span>
            </div>
            <button onClick={onLogout} className="logout-btn" title="Logout">
              🚪
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};