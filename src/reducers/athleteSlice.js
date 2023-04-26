import { createSlice } from '@reduxjs/toolkit';

export const athleteSlice = createSlice({
  name: 'athlete',
  initialState: {
    athleteId: null,
  },
  reducers: {
    setAthleteId: (state, action) => {
      state.athleteId = action.payload.athleteId;
    },
  },
});

export const { setAthleteId } = athleteSlice.actions;

export default athleteSlice.reducer;
