import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>📦 Inventory Tracker</h4>
            <p>Smart inventory management for modern businesses</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#">Dashboard</a></li>
              <li><a href="#">Products</a></li>
              <li><a href="#">Reports</a></li>
              <li><a href="#">Support</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: support@inventorytracker.com</p>
            <p>Phone: (02) 1234 5678</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Inventory Tracker. All rights reserved. | For educational purposes</p>
        </div>
      </div>
    </footer>
  );
};