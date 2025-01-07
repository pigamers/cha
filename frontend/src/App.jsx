import React from 'react';
import EntityTree from '../components/EntityTree';

function App() {
  return (
    <div className="App bg-blue-500 min-h-screen">
      <div className="py-6">
        <h1 className="text-3xl font-semibold text-center text-red-800 mb-6">Entity Management</h1>
        <EntityTree />
      </div>
    </div>
  );
}

export default App;
