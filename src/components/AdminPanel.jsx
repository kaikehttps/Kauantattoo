import React from 'react';

const AdminPanel = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-overlay" onClick={onClose}>
      <div className="admin-panel" onClick={(e) => e.stopPropagation()}>
        <div className="admin-header">
          <h3>Painel Admin</h3>
          <button onClick={onClose}>X</button>
        </div>
        <p>Painel administrativo tempor�rio</p>
      </div>
    </div>
  );
};

export default AdminPanel;
