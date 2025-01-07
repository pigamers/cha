import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntities, addEntity } from '../redux/entitySlice';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { OrganizationChart } from 'primereact/organizationchart';

const EntityTree = () => {
  const dispatch = useDispatch();

  // Redux state
  const { entities, status, error } = useSelector((state) => state.entities);

  // Local state for form inputs
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [parentId, setParentId] = useState(null);

  const entityOptions = ['CEO', 'Manager', 'HOD', 'Supervisor', 'Worker']; // Options for designation dropdown

  // Fetch entities on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEntities());
    }
  }, [status, dispatch]);

  // Handle form submission to add a new entity
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !designation) {
      console.log('Name and Designation are required.');
      return;
    }

    const newEntity = { name, designation, parentId };

    try {
      await dispatch(addEntity(newEntity));
      console.log('Entity added successfully!');
      setName('');
      setDesignation('');
      setParentId(null); // Reset form
    } catch (err) {
      console.log('Error adding entity.', err);
    }
  };

  // Prepare data for the OrganizationChart
  const prepareChartData = (entities) => {
    const map = {};
    const roots = [];

    if (!entities || entities.length === 0) return []; // Handle empty entities list

    // Build the map of entity id -> entity
    entities.forEach((entity) => {
      map[entity._id] = { label: `${entity.name} (${entity.designation})`, data: entity.name, children: [] };
    });

    // Build the chart structure
    entities.forEach((entity) => {
      if (entity.parent) {
        map[entity.parent].children.push(map[entity._id]);
      } else {
        roots.push(map[entity._id]);
      }
    });

    return roots;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-semibold">Organizational Structure</h2>
      </div>

      {/* Organization Chart */}
      {status === 'loading' && <div className="flex justify-center text-lg font-semibold">Loading...</div>}
      {status === 'failed' && <div className="text-red-500 font-semibold">{error}</div>}
      {status === 'succeeded' && entities && entities.length > 0 && (
        <div className="flex justify-center mb-6">
          <OrganizationChart value={prepareChartData(entities)} />
        </div>
      )}
      {status === 'succeeded' && entities && entities.length === 0 && (
        <div className="flex justify-center text-lg font-semibold text-gray-600">No entities found</div>
      )}

      {/* Add New Entity Form */}
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
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

          <Button type="submit" label="Add Entity" className="w-full mt-6 p-button p-button-rounded p-button-primary" />
        </form>
      </div>
    </div>
  );
};

export default EntityTree;
