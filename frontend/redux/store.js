import { configureStore } from '@reduxjs/toolkit';
import entityReducer from './entitySlice';

const store = configureStore({
  reducer: {
    entities: entityReducer, // Adding our entitySlice reducer here
  },
});

export default store;
