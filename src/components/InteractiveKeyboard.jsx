// src/components/InteractiveKeyboard.jsx
import { useState } from 'react';

export default function InteractiveKeyboard() {
  const [pressedKey, setPressedKey] = useState(null);
  const [outputText, setOutputText] = useState('');

  // Letters A-Z for our virtual keyboard
  const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const handleKeyPress = (key) => {
    setPressedKey(key);
    
    // Add the letter to output after a short delay (simulating processing)
    setTimeout(() => {
      setOutputText(prev => prev + key);
    }, 300);
    
    // Clear the pressed highlight after animation
    setTimeout(() => {
      setPressedKey(null);
    }, 200);
  };

  return (
    <div style={{
      backgroundColor: '#f5f5f5',
      borderRadius: '12px',
      padding: '20px',
      margin: '20px 0',
      fontFamily: 'sans-serif'
    }}>
      <h3>🎹 Interactive Keyboard Simulator</h3>
      
      {/* Step-by-step explanation */}
      <div style={{
        backgroundColor: '#e0e0e0',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h4>🔍 How a keypress works:</h4>
        <ol>
          <li>👆 You press a key →</li>
          <li>⚡ Switch closes →</li>
          <li>📡 Scan code sent to computer →</li>
          <li>🖥️ OS maps to character →</li>
          <li>✨ Letter appears on screen</li>
        </ol>
      </div>

      {/* Visual animation for current keypress */}
      {pressedKey && (
        <div style={{
          backgroundColor: '#ffeb3b',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center',
          animation: 'pulse 0.3s ease-in-out'
        }}>
          ⚡ Key pressed: <strong style={{fontSize: '24px'}}>{pressedKey}</strong>
        </div>
      )}

      {/* Virtual Keyboard Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: '8px',
        marginBottom: '20px'
      }}>
        {keys.map((key) => (
          <button
            key={key}
            onClick={() => handleKeyPress(key)}
            style={{
              padding: '15px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: pressedKey === key ? '#4caf50' : '#fff',
              border: '2px solid #ccc',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.1s ease'
            }}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Output Display */}
      <div style={{
        backgroundColor: '#fff',
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '15px',
        minHeight: '80px'
      }}>
        <strong>📝 Your typed text:</strong>
        <div style={{
          fontSize: '20px',
          marginTop: '10px',
          fontFamily: 'monospace',
          wordBreak: 'break-all'
        }}>
          {outputText || 'Click any letter above...'}
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={() => setOutputText('')}
        style={{
          marginTop: '15px',
          padding: '8px 16px',
          backgroundColor: '#f44336',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Clear Text
      </button>

      {/* Add simple CSS animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); background-color: #ffeb3b; }
          50% { transform: scale(1.05); background-color: #ff9800; }
          100% { transform: scale(1); background-color: #ffeb3b; }
        }
      `}</style>
    </div>
  );
}