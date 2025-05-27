import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedGift:{},
  isAchieved: false,
  navigatingFromDreamGift : false
}

export const dreamGiftSlice = createSlice({
  name: 'dreamgift',
  initialState,
  reducers: {
    setSelectedGift: (state, action) => {
      state.selectedGift = action.payload
    },
    setIsAchieved: (state, action) => {
        state.isAchieved = action.payload
      },
      setNavigationFromDreamGift: (state, action) => {
        state.navigatingFromDreamGift = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const {setSelectedGift, setIsAchieved,setNavigationFromDreamGift } = dreamGiftSlice.actions

export default dreamGiftSlice.reducer