import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const AddEntityForm = ({ entityOptions, entities, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [parentId, setParentId] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !designation) {
      console.log('Name and Designation are required.');
      return;
    }

    const newEntity = { name, designation, parentId };
    onSubmit(newEntity);
    setName('');
    setDesignation('');
    setParentId(null); // Reset form
  };

  return (
    <div className="relative p-4 w-full max-w-md max-h-full">
      <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>

        <div className="p-4 md:p-5 text-center">
          <h3 className="text-xl font-semibold mb-4">Add New Entity</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Name</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Designation</label>
              <Dropdown
                value={designation}
                options={entityOptions}
                onChange={(e) => setDesignation(e.value)}
                placeholder="Select Designation"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700">Parent Entity (Optional)</label>
              <Dropdown
                value={parentId}
                options={entities.map((entity) => ({
                  label: `${entity.name} (${entity.designation})`,
                  value: entity._id,
                }))}
                onChange={(e) => setParentId(e.value)}
                placeholder="Select Parent Entity"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between mt-6">
              <Button
                type="submit"
                label="Add Entity"
                className="w-full p-button p-button-rounded p-button-primary"
              />
              <Button
                type="button"
                label="Cancel"
                onClick={onCancel}
                className="w-full p-button p-button-rounded p-button-secondary"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEntityForm;
