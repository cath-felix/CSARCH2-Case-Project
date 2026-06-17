// src/components/TextureFilterDemo.jsx
import { useState } from 'react';

export default function TextureFilterDemo() {
  const [filterType, setFilterType] = useState('bilinear');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);
  const [consoleLogs, setConsoleLogs] = useState([
    { id: 1, message: '🔄 Texture Filtering Demo initialized', type: 'info' },
    { id: 2, message: '📐 Default filter: Bilinear', type: 'info' },
  ]);
  const [consoleInput, setConsoleInput] = useState('');

  const renderFilteredTexture = () => {
    const size = 200 * zoomLevel;
    const pixels = [];
    const gridSize = 8;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEven = (x + y) % 2 === 0;
        let color;
        
        if (!isFilterEnabled) {
          // If filter is disabled, show a grayed-out version
          color = isEven ? '#b0b0b0' : '#909090';
        } else {
          switch(filterType) {
            case 'nearest':
              color = isEven ? '#ff6b35' : '#2b7a78';
              break;
            case 'bilinear':
              const blend = Math.sin(x / gridSize * Math.PI) * 0.5 + 0.5;
              color = isEven ? `rgb(${255 - blend*50}, ${107 + blend*50}, ${53 + blend*50})` : '#2b7a78';
              break;
            case 'trilinear':
              const dist = Math.sqrt((x-gridSize/2)**2 + (y-gridSize/2)**2);
              const softness = Math.min(1, dist / (gridSize/2));
              const r = 43 + softness * 200;
              const g = 123 + softness * 20;
              const b = 120 + softness * 10;
              color = `rgb(${r}, ${g}, ${b})`;
              break;
            case 'anisotropic':
              const stretch = Math.abs(x - gridSize/2) / (gridSize/2);
              const sharpness = 1 - stretch * 0.5;
              const ar = 255 - (isEven ? 100 * sharpness : 50);
              const ag = 107 + (isEven ? 80 * sharpness : 40);
              const ab = 53 + (isEven ? 100 * sharpness : 50);
              color = `rgb(${ar}, ${ag}, ${ab})`;
              break;
            default:
              color = isEven ? '#ff6b35' : '#2b7a78';
          }
        }
        
        pixels.push(
          <rect
            key={`${x}-${y}`}
            x={x * (size/gridSize)}
            y={y * (size/gridSize)}
            width={size/gridSize}
            height={size/gridSize}
            fill={color}
          />
        );
      }
    }
    
    return (
      <svg width={size} height={size} style={{ border: '2px solid #2d3436', borderRadius: '8px', display: 'block', margin: '0 auto' }}>
        {pixels}
      </svg>
    );
  };

  const getFilterDescription = () => {
    const descriptions = {
      'nearest': '🧊 Nearest Neighbor - Fastest but blocky. Uses the closest pixel only.',
      'bilinear': '🔄 Bilinear - Smooth blending of 2x2 pixels. Good balance of speed and quality.',
      'trilinear': '📊 Trilinear - Bilinear + MIPMAP blending. Great quality for 3D games.',
      'anisotropic': '🎯 Anisotropic - Best quality! Accounts for viewing angle and perspective distortion.'
    };
    return descriptions[filterType];
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    addConsoleLog(`Filter changed to: ${type.charAt(0).toUpperCase() + type.slice(1)}`, 'info');
  };

  const handleToggleFilter = () => {
    setIsFilterEnabled(!isFilterEnabled);
    addConsoleLog(
      `Filter ${!isFilterEnabled ? 'enabled' : 'disabled'}`,
      !isFilterEnabled ? 'success' : 'warning'
    );
  };

  const addConsoleLog = (message, type = 'info') => {
    setConsoleLogs(prev => [
      ...prev,
      { id: Date.now(), message, type }
    ]);
  };

  const handleConsoleSubmit = (e) => {
    e.preventDefault();
    if (consoleInput.trim()) {
      const cmd = consoleInput.trim().toLowerCase();
      
      if (cmd === 'help') {
        addConsoleLog('Available commands: help, status, clear, reset', 'info');
      } else if (cmd === 'status') {
        addConsoleLog(`Current filter: ${filterType} (${isFilterEnabled ? 'enabled' : 'disabled'})`, 'info');
      } else if (cmd === 'clear') {
        setConsoleLogs([]);
      } else if (cmd === 'reset') {
        setFilterType('bilinear');
        setIsFilterEnabled(true);
        addConsoleLog('Demo reset to default (Bilinear, enabled)', 'success');
      } else {
        addConsoleLog(`Unknown command: "${cmd}". Type "help" for available commands.`, 'error');
      }
      
      setConsoleInput('');
    }
  };

  return (
    <div>
      <div className="magnifier-container">
        <h3>🎨 Texture Filtering Demo</h3>
        
        {/* Filter Selection Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
          {['nearest', 'bilinear', 'trilinear', 'anisotropic'].map((type) => (
            <button
              key={type}
              onClick={() => handleFilterChange(type)}
              style={{
                padding: '10px 20px',
                backgroundColor: filterType === type ? '#6c5ce7' : '#e9ecef',
                color: filterType === type ? 'white' : '#333',
                border: '2px solid ' + (filterType === type ? '#6c5ce7' : 'transparent'),
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                fontSize: '0.9rem',
              }}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        {/* Magnifier Slider */}
        <div style={{ marginBottom: '20px' }}>
          <label>
            🔍 Zoom Level: <span className="slider-value">{zoomLevel}x</span>
          </label>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.25"
            value={zoomLevel}
            onChange={(e) => {
              setZoomLevel(parseFloat(e.target.value));
              addConsoleLog(`Zoom changed to ${parseFloat(e.target.value)}x`, 'info');
            }}
          />
        </div>

        {/* Toggle Switch */}
        <div className="toggle-container">
          <span className="toggle-label">🔘 Filter Enabled</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={isFilterEnabled}
              onChange={handleToggleFilter}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-status">
            {isFilterEnabled ? (
              <span className="on">● ON</span>
            ) : (
              <span className="off">○ OFF</span>
            )}
          </span>
        </div>

        {/* Texture Display */}
        <div style={{ textAlign: 'center' }}>
          <h4 style={{ marginBottom: '10px', color: '#2d3436' }}>
            {isFilterEnabled ? getFilterDescription() : '🔴 Filter Disabled'}
          </h4>
          {renderFilteredTexture()}
        </div>

        {/* Performance Indicator */}
        <div style={{
          marginTop: '20px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: isFilterEnabled ? '#e8f5e9' : '#ffe0e0',
          borderLeft: `4px solid ${isFilterEnabled ? '#4caf50' : '#e17055'}`,
        }}>
          <strong>⚡ Performance:</strong>{' '}
          {!isFilterEnabled ? '🔴 Filter Disabled' :
            filterType === 'nearest' ? 'Very Fast (1x) ✅' :
            filterType === 'bilinear' ? 'Fast (2x) ✅' :
            filterType === 'trilinear' ? 'Moderate (4x) ⚡' :
            'Heavy (8-16x) 🔥'
          }
        </div>
      </div>

      {/* Live Console */}
      <div className="console-container">
        <div className="console-header">
          <div className="console-dots">
            <span className="console-dot red"></span>
            <span className="console-dot yellow"></span>
            <span className="console-dot green"></span>
          </div>
          <span className="console-title">tex-filter-console</span>
          <button 
            className="console-clear-btn" 
            onClick={() => setConsoleLogs([])}
          >
            Clear
          </button>
        </div>
        <div className="console-body">
          {consoleLogs.map((log) => (
            <div key={log.id} className="console-line">
              <span className="prefix">$</span>
              <span className={`message ${log.type}`}>{log.message}</span>
            </div>
          ))}
        </div>
        <form className="console-input-row" onSubmit={handleConsoleSubmit}>
          <input
            type="text"
            value={consoleInput}
            onChange={(e) => setConsoleInput(e.target.value)}
            placeholder="Type a command... (help, status, clear, reset)"
          />
          <button type="submit">Enter</button>
        </form>
      </div>
    </div>
  );
}