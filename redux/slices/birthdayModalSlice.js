import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  birthdayModal:false,

  
}

export const birthdayModalSlice = createSlice({
  name: 'birthday',
  initialState,
  reducers: {
    
    setBirthdayModal: (state, action) => {
      state.birthdayModal = action.payload
    },
    
  },
})

// Action creators are generated for each case reducer function
export const {setBirthdayModal } = birthdayModalSlice.actions

export default birthdayModalSlice.reducer