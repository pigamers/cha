import { configureStore } from '@reduxjs/toolkit';
import entityReducer from './entitySlice';

export const store = configureStore({
  reducer: {
    entities: entityReducer,
  },
});

export default store;
