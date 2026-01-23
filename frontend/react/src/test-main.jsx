import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb' }}>CampusCare Test</h1>
      <p>Frontend is working!</p>
      <div style={{ 
        backgroundColor: '#10b981', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '5px',
        display: 'inline-block'
      }}>
        React App Successfully Loaded
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
