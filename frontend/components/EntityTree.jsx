import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntities, addEntity } from '../redux/entitySlice';
import { Button } from 'primereact/button';
import { OrganizationChart } from 'primereact/organizationchart';
import AddEntityForm from './AddEntityForm'; // Import the new form component

const EntityTree = () => {
  const dispatch = useDispatch();
  const { entities, status, error } = useSelector((state) => state.entities);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility

  const entityOptions = ['CEO', 'Manager', 'HOD', 'Supervisor', 'Worker']; // Options for designation dropdown

  // Fetch entities on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEntities());
    }
  }, [status, dispatch]);

  // Handle form submission to add a new entity
  const handleAddEntity = async (newEntity) => {
    try {
      await dispatch(addEntity(newEntity));
      console.log('Entity added successfully!');
      setIsFormVisible(false); // Close form after submission
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
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Organization Chart */}
      {status === 'loading' && (
        <div className="flex justify-center text-lg font-semibold text-blue-600">
          <p>Loading organization chart...</p>
        </div>
      )}
      {status === 'failed' && (
        <div className="flex justify-center text-lg font-semibold text-red-500">
          <p>Error: {error}</p>
        </div>
      )}
      {status === 'succeeded' && entities && entities.length > 0 && (
        <div className="flex justify-center mb-6">
          <div className="w-full max-w-5xl p-4 bg-white rounded-lg shadow-lg">
            <OrganizationChart value={prepareChartData(entities)} />
          </div>
        </div>
      )}
      {status === 'succeeded' && entities && entities.length === 0 && (
        <div className="flex justify-center text-lg font-semibold text-gray-600">
          <p>No entities found</p>
        </div>
      )}

      {/* Add New Entity Button */}
      <div className="flex justify-center mt-6">
        <Button
          label="Add New Entity"
          icon="pi pi-plus"
          className="p-button p-button-rounded p-button-success p-button-lg"
          onClick={() => setIsFormVisible(true)} // Show the form when clicked
        />
      </div>

      {/* Conditionally Render AddEntityForm */}
      {isFormVisible && (
        <div
          className="fixed z-50 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              aria-hidden="true"
              onClick={() => setIsFormVisible(false)} // Close modal when clicking on backdrop
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white dark:bg-black/80 dark:text-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-black/80 dark:text-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <AddEntityForm
                  entityOptions={entityOptions}
                  entities={entities}
                  onSubmit={(newEntity) => {
                    handleAddEntity(newEntity);
                    setIsFormVisible(false); // Close form after submission
                  }}
                  onCancel={() => setIsFormVisible(false)} // Close modal when cancel is clicked
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityTree;
