import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, fortmatResponse } from '../../api/axios';
import { FacilitiesPage} from '../../types';
import { TStore } from '../../store';

interface FacilitiesState {
  data: FacilitiesPage;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FacilitiesState = {
  data: {
    items: [],
    pageInfo: {
      totalCount: 100,
      first: '1',
      last: '10',
    },
  },
  status: 'idle',
  error: null,
};

export const facilitiesSlice = createSlice({
  name: 'facilities',
  initialState,
  reducers: {
    increment: (state) => {},
  },
  extraReducers(builder) {
    builder
      .addCase(getFacilities.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(getFacilities.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data.items = JSON.parse(action.payload).data.facilities.items;
      })
      .addCase(getFacilities.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ? action.error.message : null;
      });
  },
});

export const { increment } = facilitiesSlice.actions;

export default facilitiesSlice.reducer;

export const selectAllFacilities = (state: TStore) => state.facilities;
export const selectStatusFacilities = (state: TStore) => state.facilities.status;

export const getFacilities = createAsyncThunk('facilities/fetchFacilities', async () => {
  try {
    const res = await api({
      url: '',
      method: 'post',
      data: {
        query: `
          {
            facilities(after: "", limit: 100) {
              items{
                id
                name
                email
                phoneNumber
                address{
                  streetWithNumber
                  zipCode
                  city
                }
                location{
                  lat
                  lon
                }
                createdAt
              }
            }
          }
        `,
      },
    });
    const result = {
      status: res.status,
      headers: res.headers,
      data: res.data.data,
    };
    return fortmatResponse(result);
  } catch (err) {
    return fortmatResponse(err);
  }
});
