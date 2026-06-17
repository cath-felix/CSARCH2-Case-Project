// src/components/TextureFilterDemo.jsx
import { useState } from 'react';

export default function TextureFilterDemo() {
  const [filterType, setFilterType] = useState('bilinear');
  const [zoomLevel, setZoomLevel] = useState(1);

  const renderFilteredTexture = () => {
    const size = 200 * zoomLevel;
    const pixels = [];
    const gridSize = 8;
    
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const isEven = (x + y) % 2 === 0;
        let color;
        
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
      <svg 
        width={size} 
        height={size} 
        className="mx-auto border-2 border-gray-700 rounded-lg shadow-md"
        style={{ display: 'block' }}
      >
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

  return (
    <div className="bg-gray-100 rounded-xl p-5 my-5 shadow-md">
      <h3 className="text-xl font-bold mb-4">🎨 Texture Filtering Demo</h3>
      
      {/* Filter Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['nearest', 'bilinear', 'trilinear', 'anisotropic'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              filterType === type 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Zoom Control */}
      <div className="mb-5 flex items-center gap-4">
        <label className="font-medium">🔍 Zoom: {zoomLevel}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.25"
          value={zoomLevel}
          onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
          className="w-48 accent-blue-600"
        />
      </div>

      {/* Texture Display */}
      <div className="text-center">
        <h4 className="text-lg font-semibold mb-3 text-gray-700">
          {getFilterDescription()}
        </h4>
        {renderFilteredTexture()}
      </div>

      {/* Performance Indicator */}
      <div className="mt-5 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
        <strong className="text-gray-800">⚡ Performance:</strong>{' '}
        {filterType === 'nearest' && <span className="text-green-600 font-medium">Very Fast (1x) ✅</span>}
        {filterType === 'bilinear' && <span className="text-green-600 font-medium">Fast (2x) ✅</span>}
        {filterType === 'trilinear' && <span className="text-yellow-600 font-medium">Moderate (4x) ⚡</span>}
        {filterType === 'anisotropic' && <span className="text-red-600 font-medium">Heavy (8-16x) 🔥</span>}
      </div>

      {/* Explanation */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 mb-2">💡 What's happening here?</h4>
        <p className="text-gray-700 text-sm">
          This demo simulates how different texture filtering methods display a checkerboard texture.
          <br />
          • <span className="font-semibold">Nearest</span> = Sharp edges (pixelated)
          <br />
          • <span className="font-semibold">Bilinear</span> = Smooth transitions (blurry when zoomed)
          <br />
          • <span className="font-semibold">Trilinear</span> = Uses multiple texture sizes (smooth at distance)
          <br />
          • <span className="font-semibold">Anisotropic</span> = Preserves detail at angles (clearest)
        </p>
      </div>
    </div>
  );
}