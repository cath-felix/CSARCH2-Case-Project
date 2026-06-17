// src/components/TextureFilterDemo.jsx
import { useState } from 'react';

export default function TextureFilterDemo() {
  // Only 2 modes: Nearest and Bilinear
  const MODES = [
    { id: 'nearest', label: 'Nearest Neighbor', emoji: '🧊', 
      description: 'Uses closest pixel only — fast but blocky',
      formula: 'P(x,y) = P(round(x), round(y))',
      performance: '⚡ Fastest (1x)' },
    { id: 'bilinear', label: 'Bilinear', emoji: '🌊', 
      description: 'Averages 2x2 surrounding pixels — smooth but blurry',
      formula: 'P(x,y) = (TL + TR + BL + BR) / 4',
      performance: '⚡ Good (2x)' },
  ];

  const [currentModeIndex, setCurrentModeIndex] = useState(1); // Start at Bilinear
  const [zoomLevel, setZoomLevel] = useState(1);
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Welcome to the Texture Explorer!', type: 'info' },
    { id: 2, text: '🔍 Use the slider to zoom in on the pattern', type: 'info' },
    { id: 3, text: '🔄 Click the toggle to switch between Nearest and Bilinear', type: 'info' },
    { id: 4, text: '📌 Current mode: 🌊 Bilinear — smooth but blurry', type: 'info' },
  ]);
  const [input, setInput] = useState('');

  const currentMode = MODES[currentModeIndex];

  const toggleMode = () => {
    const newIndex = currentModeIndex === 0 ? 1 : 0;
    setCurrentModeIndex(newIndex);
    const mode = MODES[newIndex];
    addMessage(`${mode.emoji} Switched to ${mode.label} — ${mode.description}`, 'success');
    addMessage(`📐 Formula: ${mode.formula}`, 'info');
  };

  // Generate texture with different filtering effects
  const renderTexture = () => {
    const size = Math.min(400, 180 * Math.sqrt(zoomLevel));
    const gridSize = Math.max(4, Math.min(20, Math.floor(8 * Math.sqrt(zoomLevel))));
    const pixels = [];
    
    // Create a pattern with hidden letters
    const letters = 'GPU'.split('');
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEven = (x + y) % 2 === 0;
        const isText = (x >= gridSize/4 && x < gridSize*0.75 && y >= gridSize/4 && y < gridSize*0.75);
        const centerX = gridSize/2;
        const centerY = gridSize/2;
        const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
        const maxDist = gridSize/2;
        const ring = Math.floor((dist / maxDist) * 4) % 2 === 0;
        
        let color;
        const mode = currentMode.id;
        
        if (mode === 'nearest') {
          // Nearest Neighbor — sharp, blocky
          if (isText && isEven) color = '#e74c3c';
          else if (isText) color = '#2ecc71';
          else if (ring) color = '#3498db';
          else if (isEven) color = '#2c3e50';
          else color = '#ecf0f1';
        } else {
          // Bilinear — smooth, blended
          const blendX = Math.sin(x / gridSize * Math.PI * 2) * 0.5 + 0.5;
          const blendY = Math.cos(y / gridSize * Math.PI * 2) * 0.5 + 0.5;
          const r = Math.floor(80 + blendX * 120 + (isText ? 60 : 0));
          const g = Math.floor(60 + blendY * 100 + (isText ? 60 : 0));
          const b = Math.floor(180 - blendX * 80);
          color = `rgb(${r % 255}, ${g % 255}, ${b % 255})`;
        }
        
        const sizePerCell = size / gridSize;
        pixels.push(
          <rect
            key={`${x}-${y}`}
            x={x * sizePerCell}
            y={y * sizePerCell}
            width={sizePerCell}
            height={sizePerCell}
            fill={color}
            stroke={mode === 'nearest' ? '#1a1a2e' : 'none'}
            strokeWidth="0.5"
          />
        );
      }
    }
    
    return (
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg 
          width={size} 
          height={size} 
          style={{ 
            border: '4px solid #2d3436', 
            borderRadius: '12px', 
            display: 'block', 
            margin: '0 auto',
            backgroundColor: '#1a1a2e',
            boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
            transition: 'all 0.3s ease'
          }}
        >
          {pixels}
        </svg>
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0,0,0,0.8)',
          color: '#a8e6cf',
          padding: '6px 14px',
          borderRadius: '8px',
          fontSize: '0.75rem',
          fontFamily: 'monospace'
        }}>
          🔍 {zoomLevel}x | {currentMode.label}
        </div>
      </div>
    );
  };

  const addMessage = (text, type = 'info') => {
    setMessages(prev => [...prev, { id: Date.now(), text, type }]);
  };

  const handleZoom = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    
    if (newZoom === 1) {
      addMessage('🔍 Zoom: 1x — Compare the two methods!', 'info');
    } else if (newZoom >= 4 && newZoom < 8) {
      addMessage(`🔍 Zoom: ${newZoom}x — Notice the difference in edges`, 'info');
    } else if (newZoom >= 8 && newZoom < 16) {
      addMessage(`🔍 Zoom: ${newZoom}x — ${currentMode.label} shows its true character`, 'info');
    } else if (newZoom >= 16) {
      addMessage(`🔍 Zoom: ${newZoom}x — ${currentMode.label} at extreme zoom!`, 'success');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const cmd = input.trim().toLowerCase();
      
      if (cmd === 'help') {
        addMessage('📋 Commands:', 'info');
        addMessage('  help - Show this menu', 'info');
        addMessage('  status - Show current settings', 'info');
        addMessage('  clear - Clear console', 'info');
        addMessage('  reset - Reset to Bilinear, 1x', 'info');
        addMessage('  toggle - Switch between Nearest/Bilinear', 'info');
        addMessage('  compare - Show comparison side-by-side', 'info');
        addMessage('  formula - Show current formula', 'info');
        addMessage('  hello - Say hello!', 'info');
      } else if (cmd === 'status') {
        addMessage(`📊 Mode: ${currentMode.emoji} ${currentMode.label} | Zoom: ${zoomLevel}x`, 'info');
        addMessage(`  ${currentMode.description}`, 'info');
        addMessage(`  Formula: ${currentMode.formula}`, 'info');
      } else if (cmd === 'clear') {
        setMessages([]);
        addMessage('🧹 Console cleared!', 'info');
      } else if (cmd === 'reset') {
        setCurrentModeIndex(1); // Bilinear
        setZoomLevel(1);
        addMessage('🔄 Reset to default: Bilinear, 1x zoom', 'success');
      } else if (cmd === 'toggle') {
        toggleMode();
      } else if (cmd === 'compare') {
        addMessage('📊 Comparison:', 'info');
        addMessage('  🧊 Nearest: Fast, blocky, uses closest pixel', 'info');
        addMessage('  🌊 Bilinear: Smooth, blends 2x2 pixels', 'info');
        addMessage('  💡 Tip: Zoom in to see the difference clearly!', 'info');
      } else if (cmd === 'formula') {
        addMessage(`📐 Formula: ${currentMode.formula}`, 'info');
        addMessage(`  ${currentMode.description}`, 'info');
      } else if (cmd === 'hello') {
        addMessage('👋 Hello! Try typing "compare" to see the difference!', 'success');
      } else {
        addMessage(`❌ Unknown: "${cmd}". Try: help, status, clear, reset, toggle, compare, formula`, 'error');
      }
      setInput('');
    }
  };

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* ===== MAIN DEMO CARD ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title */}
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>🔍 Texture Explorer</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#6c757d' }}>
              Compare Nearest Neighbor vs Bilinear Filtering
            </p>
          </div>

          {/* Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>1x</span>
              <span style={{ 
                backgroundColor: '#6c5ce7', 
                color: 'white', 
                padding: '2px 16px', 
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: '700'
              }}>
                {zoomLevel}x
              </span>
              <span style={{ fontSize: '0.8rem', fontWeight: '600' }}>32x</span>
            </div>
            <input
              type="range"
              min="1"
              max="32"
              step="0.5"
              value={zoomLevel}
              onChange={handleZoom}
              style={{
                width: '100%',
                height: '8px',
                borderRadius: '4px',
                background: `linear-gradient(to right, #6c5ce7 0%, #6c5ce7 ${((zoomLevel - 1) / 31) * 100}%, #dfe6e9 ${((zoomLevel - 1) / 31) * 100}%, #dfe6e9 100%)`,
                outline: 'none',
                WebkitAppearance: 'none',
                appearance: 'none'
              }}
            />
          </div>

          {/* ===== TOGGLE / SWITCH ===== */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            flexWrap: 'wrap',
            padding: '12px 16px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #dee2e6'
          }}>
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>🔄 Compare:</span>
            
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '56px',
              height: '28px',
              flexShrink: 0,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={currentModeIndex === 1}
                onChange={toggleMode}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: currentModeIndex === 0 ? '#e17055' : '#6c5ce7',
                borderRadius: '28px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '20px',
                  width: '20px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: currentModeIndex === 1 ? 'translateX(28px)' : 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></span>
              </span>
            </label>

            <span style={{ 
              fontWeight: '700', 
              fontSize: '1rem',
              minWidth: '130px',
              color: currentModeIndex === 0 ? '#e17055' : '#6c5ce7'
            }}>
              {currentMode.emoji} {currentMode.label}
            </span>
            
            <span style={{ 
              fontSize: '0.8rem', 
              color: '#6c757d',
              backgroundColor: '#f8f9fa',
              padding: '2px 12px',
              borderRadius: '12px',
              flex: 1,
              minWidth: '150px'
            }}>
              {currentMode.description}
            </span>

            {/* Mode indicator dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {MODES.map((mode, i) => (
                <span key={i} style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: i === currentModeIndex ? '#6c5ce7' : '#dfe6e9',
                  transition: 'all 0.3s'
                }} />
              ))}
            </div>
          </div>

          {/* Texture Display */}
          <div style={{ textAlign: 'center' }}>
            {renderTexture()}
          </div>

          {/* Quick Stats with Formula */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '8px',
            padding: '12px',
            backgroundColor: 'white',
            borderRadius: '10px',
            border: '1px solid #dee2e6'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Zoom</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{zoomLevel}x</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Mode</div>
              <div style={{ fontSize: '1rem', fontWeight: '700', color: '#6c5ce7' }}>
                {currentMode.emoji} {currentMode.label}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Formula</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '600', fontFamily: 'monospace' }}>
                {currentMode.formula}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Performance</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: currentModeIndex === 0 ? '#00b894' : '#6c5ce7' }}>
                {currentMode.performance}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== LIVE CONSOLE ===== */}
      <div style={{
        backgroundColor: '#1e1e2e',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #2d3436',
        margin: '20px 0'
      }}>
        {/* Console Header */}
        <div style={{
          backgroundColor: '#2d3436',
          padding: '10px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          borderBottom: '1px solid #3d3d4e'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f57', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e', display: 'inline-block' }}></span>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#28c840', display: 'inline-block' }}></span>
          </div>
          <span style={{ color: '#a0a0b0', fontSize: '0.75rem', fontFamily: 'monospace' }}>
            📝 Activity Log
          </span>
          <button 
            onClick={() => setMessages([])}
            style={{
              marginLeft: 'auto',
              backgroundColor: 'transparent',
              border: '1px solid #3d3d4e',
              color: '#a0a0b0',
              padding: '2px 12px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}
          >
            Clear
          </button>
        </div>

        {/* Console Messages */}
        <div style={{
          padding: '12px 18px',
          minHeight: '120px',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.82rem',
          backgroundColor: '#1e1e2e',
          color: '#dfe6e9',
          lineHeight: '1.8'
        }}>
          {messages.map((msg) => (
            <div key={msg.id} style={{ 
              display: 'flex',
              gap: '10px',
              padding: '1px 0',
              borderBottom: '1px solid rgba(255,255,255,0.03)'
            }}>
              <span style={{ color: '#6c5ce7', minWidth: '16px' }}>›</span>
              <span style={{
                color: msg.type === 'success' ? '#55efc4' :
                       msg.type === 'warning' ? '#fdcb6e' :
                       msg.type === 'error' ? '#ff7675' : '#dfe6e9'
              }}>
                {msg.text}
              </span>
            </div>
          ))}
          {messages.length === 0 && (
            <div style={{ color: '#636e72', fontStyle: 'italic', padding: '10px 0' }}>
              No messages yet. Start exploring!
            </div>
          )}
        </div>

        {/* Console Input */}
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          gap: '8px',
          padding: '8px 18px 14px 18px',
          backgroundColor: '#1a1a2a',
          borderTop: '1px solid #2d3436'
        }}>
          <span style={{ color: '#6c5ce7', fontFamily: 'monospace', fontSize: '0.9rem', paddingTop: '6px' }}>$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command... (help, toggle, compare, formula)"
            style={{
              flex: 1,
              padding: '6px 12px',
              border: '1px solid #3d3d4e',
              borderRadius: '6px',
              backgroundColor: '#2d3436',
              color: '#dfe6e9',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          <button type="submit" style={{
            padding: '6px 16px',
            backgroundColor: '#6c5ce7',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}>
            Enter
          </button>
        </form>
      </div>

      {/* ===== COMPARISON SUMMARY TABLE ===== */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        marginTop: '12px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>📊 Nearest Neighbor vs Bilinear</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px'
        }}>
          {MODES.map((mode, i) => {
            const isActive = i === currentModeIndex;
            const isNearest = mode.id === 'nearest';
            return (
              <div key={mode.id} style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: isActive ? `3px solid ${isNearest ? '#e17055' : '#6c5ce7'}` : '1px solid #e9ecef',
                backgroundColor: isActive ? (isNearest ? '#fff3e0' : '#e3f2fd') : '#f8f9fa',
                transition: 'all 0.3s'
              }}>
                <div style={{ 
                  fontWeight: '700', 
                  fontSize: '1rem',
                  color: isNearest ? '#e17055' : '#6c5ce7'
                }}>
                  {mode.emoji} {mode.label}
                  {isActive && <span style={{ fontSize: '0.7rem', color: isNearest ? '#e17055' : '#6c5ce7', marginLeft: '8px' }}>◀ ACTIVE</span>}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#6c757d', marginTop: '4px' }}>{mode.description}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginTop: '4px' }}>
                  {mode.formula}
                </div>
                <div style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: '600', 
                  marginTop: '4px',
                  color: isNearest ? '#00b894' : '#6c5ce7'
                }}>
                  {mode.performance}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div style={{
        padding: '12px 18px',
        backgroundColor: '#fff3cd',
        borderRadius: '10px',
        border: '1px solid #ffc107',
        fontSize: '0.85rem',
        color: '#856404',
        marginTop: '12px'
      }}>
        💡 <strong>Tips:</strong> Click the toggle to switch between Nearest Neighbor and Bilinear! 
        Zoom in to see the difference clearly. Type <strong>help</strong> in the console for commands.
        Try typing <strong>compare</strong> for more info!
      </div>
    </div>
  );
}