import React from 'react';
import EntityTree from '../components/EntityTree';

function App() {
  return (
    <div className="bg-blue-300 min-h-screen">
      <div className="py-6">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Organizational Structure</h1>
        <EntityTree />
      </div>
    </div>
  );
}

export default App;
