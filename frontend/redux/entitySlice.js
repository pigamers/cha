import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an initial state
const initialState = {
  entities: [],
  status: 'idle', // loading state: idle, loading, succeeded, failed
  error: null,
};

// Async thunk to fetch entities from the backend
export const fetchEntities = createAsyncThunk('entities/fetchEntities', async () => {
  const response = await axios.get('http://localhost:8000/api/v1/entities');
  return response.data;
});

// Async thunk to create a new entity
export const addEntity = createAsyncThunk(
  'entities/addEntity',
  async (newEntity) => {
    const response = await axios.post('http://localhost:8000/api/v1/entities', newEntity);
    return response.data;
  }
);

const entitySlice = createSlice({
  name: 'entities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch entities
      .addCase(fetchEntities.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEntities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities = action.payload;
      })
      .addCase(fetchEntities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Add a new entity
      .addCase(addEntity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addEntity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.entities.push(action.payload);
      })
      .addCase(addEntity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default entitySlice.reducer;
