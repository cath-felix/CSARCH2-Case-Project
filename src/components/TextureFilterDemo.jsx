// src/components/TextureFilterDemo.jsx
import { useState } from 'react';

export default function TextureFilterDemo() {
  // 4 filtering modes
  const MODES = [
    { id: 'nearest', label: 'Sharp', emoji: '🧊', description: 'Uses closest pixel only — blocky but fast' },
    { id: 'bilinear', label: 'Smooth', emoji: '🌊', description: 'Averages 2x2 pixels — soft and smooth' },
    { id: 'bicubic', label: 'Crisp', emoji: '✨', description: 'Uses 4x4 pixels — sharp details' },
    { id: 'anisotropic', label: 'Detailed', emoji: '🎯', description: 'Adjusts for viewing angle — best quality' },
  ];

  const [currentModeIndex, setCurrentModeIndex] = useState(1); // Start at Smooth
  const [zoomLevel, setZoomLevel] = useState(1);
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 Welcome to the Texture Explorer!', type: 'info' },
    { id: 2, text: '🔍 Use the slider to zoom in on the pattern', type: 'info' },
    { id: 3, text: '🔄 Click the toggle to cycle through 4 modes!', type: 'info' },
    { id: 4, text: `📌 Current mode: ${MODES[1].emoji} ${MODES[1].label} — ${MODES[1].description}`, type: 'info' },
  ]);
  const [input, setInput] = useState('');

  const currentMode = MODES[currentModeIndex];

  const getNextMode = () => {
    return (currentModeIndex + 1) % MODES.length;
  };

  const getPreviousMode = () => {
    return (currentModeIndex - 1 + MODES.length) % MODES.length;
  };

  // Generate texture with different filtering effects
  const renderTexture = () => {
    const size = Math.min(400, 180 * Math.sqrt(zoomLevel));
    const gridSize = Math.max(4, Math.min(20, Math.floor(8 * Math.sqrt(zoomLevel))));
    const pixels = [];
    
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
        
        switch(mode) {
          case 'nearest':
            // Sharp, blocky — each pixel is distinct
            if (isText && isEven) color = '#e74c3c';
            else if (isText) color = '#2ecc71';
            else if (ring) color = '#3498db';
            else if (isEven) color = '#2c3e50';
            else color = '#ecf0f1';
            break;
            
          case 'bilinear':
            // Smooth — soft gradients
            const blendX = Math.sin(x / gridSize * Math.PI * 2) * 0.5 + 0.5;
            const blendY = Math.cos(y / gridSize * Math.PI * 2) * 0.5 + 0.5;
            const r = Math.floor(80 + blendX * 120 + (isText ? 60 : 0));
            const g = Math.floor(60 + blendY * 100 + (isText ? 60 : 0));
            const b = Math.floor(180 - blendX * 80);
            color = `rgb(${r % 255}, ${g % 255}, ${b % 255})`;
            break;
            
          case 'bicubic':
            // Crisp — sharper transitions
            const wave = Math.sin(x / gridSize * Math.PI * 3) * 0.3 + Math.cos(y / gridSize * Math.PI * 3) * 0.3 + 0.4;
            const r2 = Math.floor(50 + wave * 150 + (isText ? 80 : 0));
            const g2 = Math.floor(30 + wave * 100 + (isText ? 80 : 0));
            const b2 = Math.floor(200 - wave * 100);
            color = `rgb(${Math.min(255, r2)}, ${Math.min(255, g2)}, ${Math.min(255, b2)})`;
            break;
            
          case 'anisotropic':
            // Detailed — directional detail
            const dirX = Math.abs(x - centerX) / maxDist;
            const dirY = Math.abs(y - centerY) / maxDist;
            const detail = Math.max(0, 1 - (dirX * 0.5 + dirY * 0.3));
            const r3 = Math.floor(100 + detail * 120 + (isText ? 50 : 0));
            const g3 = Math.floor(80 + detail * 80 + (isText ? 50 : 0));
            const b3 = Math.floor(120 + detail * 80);
            color = `rgb(${Math.min(255, r3)}, ${Math.min(255, g3)}, ${Math.min(255, b3)})`;
            break;
            
          default:
            color = isEven ? '#3498db' : '#2c3e50';
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
          🔍 {zoomLevel}x
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
      addMessage('🔍 Zoom: 1x — Can you see the hidden pattern?', 'info');
    } else if (newZoom >= 4 && newZoom < 8) {
      addMessage(`🔍 Zoom: ${newZoom}x — Getting closer!`, 'info');
    } else if (newZoom >= 8 && newZoom < 16) {
      addMessage(`🔍 Zoom: ${newZoom}x — Almost there!`, 'info');
    } else if (newZoom >= 16) {
      addMessage(`🔍 Zoom: ${newZoom}x — Look at those details! 🎨`, 'success');
    }
  };

  const handleToggle = () => {
    const nextIndex = getNextMode();
    setCurrentModeIndex(nextIndex);
    const mode = MODES[nextIndex];
    addMessage(`${mode.emoji} Switched to ${mode.label} mode — ${mode.description}`, 'success');
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
        addMessage('  reset - Reset to default (Smooth, 1x)', 'info');
        addMessage('  next - Switch to next mode', 'info');
        addMessage('  prev - Switch to previous mode', 'info');
        addMessage('  modes - List all available modes', 'info');
        addMessage('  hello - Say hello!', 'info');
        addMessage('  secret - Reveal a secret message', 'info');
      } else if (cmd === 'status') {
        addMessage(`📊 Mode: ${currentMode.emoji} ${currentMode.label} | Zoom: ${zoomLevel}x`, 'info');
        addMessage(`  ${currentMode.description}`, 'info');
      } else if (cmd === 'clear') {
        setMessages([]);
        addMessage('🧹 Console cleared!', 'info');
      } else if (cmd === 'reset') {
        setCurrentModeIndex(1); // Smooth
        setZoomLevel(1);
        addMessage('🔄 Reset to default: Smooth mode, 1x zoom', 'success');
      } else if (cmd === 'next' || cmd === 'toggle') {
        handleToggle();
      } else if (cmd === 'prev') {
        const prevIndex = getPreviousMode();
        setCurrentModeIndex(prevIndex);
        const mode = MODES[prevIndex];
        addMessage(`${mode.emoji} Switched to ${mode.label} mode — ${mode.description}`, 'success');
      } else if (cmd === 'modes') {
        addMessage('📋 Available modes:', 'info');
        MODES.forEach((m, i) => {
          addMessage(`  ${i+1}. ${m.emoji} ${m.label} — ${m.description}`, 'info');
        });
      } else if (cmd === 'hello') {
        addMessage('👋 Hello, explorer! Ready to explore textures?', 'success');
      } else if (cmd === 'secret') {
        addMessage('🤫 The hidden message is: "TEXTURE FILTERING MAKES GRAPHICS BEAUTIFUL!"', 'success');
      } else {
        addMessage(`❌ Unknown: "${cmd}". Try: help, status, clear, reset, next, prev, modes, hello, secret`, 'error');
      }
      setInput('');
    }
  };

  // Get performance rating based on mode
  const getPerformance = (modeId) => {
    switch(modeId) {
      case 'nearest': return { speed: '⚡⚡⚡', label: 'Fastest', color: '#00b894' };
      case 'bilinear': return { speed: '⚡⚡', label: 'Good', color: '#6c5ce7' };
      case 'bicubic': return { speed: '⚡', label: 'Heavy', color: '#fdcb6e' };
      case 'anisotropic': return { speed: '💪', label: 'Most Demanding', color: '#e17055' };
      default: return { speed: '⚡⚡', label: 'Good', color: '#6c5ce7' };
    }
  };

  const perf = getPerformance(currentMode.id);

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* ===== MODE SELECTOR CARD ===== */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        borderRadius: '16px',
        padding: '24px',
        margin: '20px 0',
        border: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Title */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.3rem' }}>🔍 Texture Explorer</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#6c757d' }}>
                Compare 4 different texture filtering modes!
              </p>
            </div>
            <div style={{
              padding: '4px 16px',
              backgroundColor: perf.color + '22',
              border: `2px solid ${perf.color}`,
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              color: perf.color
            }}>
              {perf.speed} {perf.label}
            </div>
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
            <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>🔄 Cycle Modes:</span>
            
            <label style={{
              position: 'relative',
              display: 'inline-block',
              width: '60px',
              height: '30px',
              flexShrink: 0,
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={currentModeIndex >= 2}
                onChange={handleToggle}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: currentModeIndex === 0 ? '#e17055' : 
                                currentModeIndex === 1 ? '#6c5ce7' :
                                currentModeIndex === 2 ? '#fdcb6e' : '#00b894',
                borderRadius: '30px',
                transition: '0.3s'
              }}>
                <span style={{
                  position: 'absolute',
                  height: '22px',
                  width: '22px',
                  left: '4px',
                  bottom: '4px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '0.3s',
                  transform: `translateX(${currentModeIndex * 7}px)`,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}></span>
              </span>
            </label>

            <span style={{ 
              fontWeight: '700', 
              fontSize: '1.1rem',
              minWidth: '80px',
              color: currentModeIndex === 0 ? '#e17055' : 
                     currentModeIndex === 1 ? '#6c5ce7' :
                     currentModeIndex === 2 ? '#fdcb6e' : '#00b894'
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
            <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
              {MODES.map((mode, i) => (
                <span key={i} style={{
                  width: '10px',
                  height: '10px',
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

          {/* Quick Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
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
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#6c5ce7' }}>
                {currentMode.emoji} {currentMode.label}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Step</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: '#00b894' }}>
                {(1 / zoomLevel).toFixed(4)}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', color: '#6c757d', textTransform: 'uppercase' }}>Performance</div>
              <div style={{ fontSize: '0.9rem', fontWeight: '700', color: perf.color }}>
                {perf.speed} {perf.label}
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
            placeholder="Type a command... (help, next, prev, modes, reset)"
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

      {/* ===== MODE COMPARISON TABLE ===== */}
      <div style={{
        padding: '16px 20px',
        backgroundColor: 'white',
        borderRadius: '12px',
        border: '1px solid #dee2e6',
        marginTop: '12px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}>📊 Mode Comparison</h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '8px'
        }}>
          {MODES.map((mode, i) => {
            const isActive = i === currentModeIndex;
            const perf2 = getPerformance(mode.id);
            return (
              <div key={mode.id} style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: isActive ? `3px solid ${perf2.color}` : '1px solid #e9ecef',
                backgroundColor: isActive ? perf2.color + '18' : '#f8f9fa',
                transition: 'all 0.3s'
              }}>
                <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>
                  {mode.emoji} {mode.label}
                  {isActive && <span style={{ fontSize: '0.7rem', color: perf2.color, marginLeft: '6px' }}>◀ ACTIVE</span>}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{mode.description}</div>
                <div style={{ fontSize: '0.7rem', color: perf2.color, fontWeight: '600', marginTop: '4px' }}>
                  {perf2.speed} {perf2.label}
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
        💡 <strong>Tips:</strong> Click the toggle to cycle through 4 modes! 
        Each mode shows a different filtering technique. Type <strong>help</strong> in the console for commands.
        Try typing <strong>modes</strong> to see all options!
      </div>
    </div>
  );
}