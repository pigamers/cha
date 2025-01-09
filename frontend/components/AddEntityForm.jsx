import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParents, addEntity } from '../redux/entitySlice';

export default function AddEntityForm({ onClose }) {
  const dispatch = useDispatch();
  const parents = useSelector((state) => state.entities.parentEntities);

  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    parent: '' // Initialize parent as empty string
  });

  // Log the form data whenever it changes
  useEffect(() => {
    console.log('Current form data:', formData);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('Handle change:', { name, value }); // Debug log
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create the entity data object
    const entityData = {
      name: formData.name,
      designation: formData.designation,
      parent: formData.parent || null // If parent is empty string, convert to null
    };

    console.log('Submitting entity data:', entityData); // Debug log

    try {
      await dispatch(addEntity(entityData)).unwrap();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error('Failed to add entity:', error);
    }
  };

  useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);

  return (
    <div className="fixed font-mono inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center w-full min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg mx-auto" onClick={(e) => e.stopPropagation()}>
        <h1 className="font-bold text-2xl text-gray-800 text-center my-4">
          Add a New Entity Here!
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Name input */}
          <div className='my-4'>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Name -
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter name"
              required
            />
          </div>

          {/* Designation select */}
          <div className='my-4'>
            <label
              htmlFor="designation"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Designation -
            </label>
            <select
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a designation</option>
              <option value="CEO">CEO</option>
              <option value="Manager">Manager</option>
              <option value="Head of the Department">Head of the Department</option>
              <option value="Shift Supervisor">Shift Supervisor</option>
              <option value="Worker">Worker</option>
            </select>
          </div>

          {/* Parent select */}
          <div className='my-4'>
            <label
              htmlFor="parent"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Parent -
            </label>
            <select
              id="parent"
              name="parent"
              value={formData.parent}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required={formData.designation !== 'CEO'} // Only required if not CEO
            >
              <option value="">Select a parent</option>
              {parents && parents.map((parent) => (
                <option key={parent._id} value={parent._id}>
                  {parent.name}
                </option>
              ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-5 my-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
