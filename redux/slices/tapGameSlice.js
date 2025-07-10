import { createSlice } from '@reduxjs/toolkit';

const tapGameSlice = createSlice({
  name: 'tapGame',
  initialState: {
    score: 0,
  },
  reducers: {
    incrementScore: (state) => {
      state.score += 1;
    },
    resetScore: (state) => {
      state.score = 0;
    },
  },
});

export const { incrementScore, resetScore } = tapGameSlice.actions;
export default tapGameSlice.reducer;