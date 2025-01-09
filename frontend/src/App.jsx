import React, { useState } from 'react';
import EntityTree from '../components/EntityTree';
import AddEntityForm from '../components/AddEntityForm';

function App() {
  const [showModal, setShowModal] = useState(false);

  const handleOnCloseModal = () => {
    setShowModal(false);  // Close the modal
  };

  return (
    <>
      {showModal ? (
        <AddEntityForm onClose={handleOnCloseModal} />  // Pass the onClose function
      ) : (
        <div className="py-6">
          <div className="flex justify-center gap-6">
            <h1 className="text-3xl font-semibold text-center text-white mb-6">Organizational Structure</h1>
            <div>
              <button
                type="button"
                onClick={() => { setShowModal(true) }}  // Open modal
                className="rounded bg-blue-500 px-4 py-2 text-lg font-semibold text-white shadow-sm hover:bg-blue-400 w-full"
              >
                Add New +
              </button>
            </div>
          </div>
          <EntityTree />
        </div>
      )}
    </>
  );
}

export default App;
