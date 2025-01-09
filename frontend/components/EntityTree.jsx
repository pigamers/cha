import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEntities } from '../redux/entitySlice';
import { OrganizationChart } from 'primereact/organizationchart';

const EntityTree = () => {
  const dispatch = useDispatch();
  const { entities, status, error } = useSelector((state) => state.entities);

  // Fetch entities on component mount
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchEntities());
    }
  }, [status, dispatch]);

  // Simplified prepareChartData as data is already in correct format
  const prepareChartData = (entities) => {
    if (!entities || entities.length === 0) return [];
    // If entities is already an array, wrap it in an array to match your data structure
    return Array.isArray(entities) ? entities : [entities];
  };

  return (
    <div>
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
        <div>
          <OrganizationChart value={prepareChartData(entities)} />
        </div>
      )}

      {status === 'succeeded' && entities && entities.length === 0 && (
        <div className="flex justify-center text-lg font-semibold text-gray-600">
          <p>No entities found</p>
        </div>
      )}
    </div>
  );
};

export default EntityTree;
