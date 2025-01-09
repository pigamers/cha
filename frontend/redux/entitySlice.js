import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state for entities
const initialState = {
  entities: [],
  designations: [],
  parentEntities: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch entities from the backend
export const fetchEntities = createAsyncThunk(
  'entities/fetchEntities',
  async () => {
    const response = await axios.get('http://localhost:8000/api/v1/entities');
    return response.data; // Returning fetched entities
  }
);

// Async thunk to fetch parent entities
export const fetchParents = createAsyncThunk(
  'entities/fetchParents',
  async () => {
    const response = await axios.get('http://localhost:8000/api/v1/parent');
    return response.data; // Returning fetched parent entities
  }
);

// Async thunk to create a new entity
export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async (entityData) => {
    try {
      console.log('Sending to server:', entityData); // Debug log

      // Validate data before sending
      if (!entityData.name || !entityData.designation) {
        throw new Error('Name and designation are required');
      }

      const response = await axios.post('http://localhost:8000/api/v1/entities', entityData);
      console.log('Server response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error in addEntity:', error);
      throw error.response?.data || error;
    }
  }
);


const entitySlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {
    // Action to reset status and error
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entities Cases
      .addCase(fetchEntities.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload; // Store fetched entities
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || "Failed to fetch entities"; // Capture any errors
      })

      // Fetch Parents Cases
      .addCase(fetchParents.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.parentEntities = action.payload; // Store fetched parent entities
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || "Failed to fetch parent entities"; // Capture any errors
      })

      // Add Entity Cases
      .addCase(addEntity.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addEntity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities.push(action.payload); // Add new entity to the state
      })
      .addCase(addEntity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || "Failed to add entity"; // Capture any errors
      });
  }
});

// Export actions
export const { resetStatus } = entitySlice.actions;

// Export selectors
export const selectAllEntities = (state) => state.entities.entities;
export const selectParentEntities = (state) => state.entities.parentEntities;
export const selectStatus = (state) => state.entities.status;
export const selectError = (state) => state.entities.error;

// Export reducer
export default entitySlice.reducer;
