import { configureStore } from '@reduxjs/toolkit';
import facilitiesReducer from '../features/facilities/facilitiesSlice';

const store = configureStore({
  reducer: {
    facilities: facilitiesReducer,
  },
});

export default store;
export type TStore = ReturnType<typeof store.getState>;
