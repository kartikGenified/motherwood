import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  apiCallStatus: [] 
}

export const splashApiCallsSlice = createSlice({
  name: 'splashApi',
  initialState,
  reducers: {
    setApiCallStatus: (state, action) => {
      const set = new Set(state.apiCallStatus)
      set.add(action.payload)
      state.apiCallStatus = Array.from(set) 
    },
    removeApiCallStatus: (state, action) => {
      const set = new Set(state.apiCallStatus)
      set.delete(action.payload)
      state.apiCallStatus = Array.from(set)
    },
    clearApiCallStatus: (state) => {
      state.apiCallStatus = []
    }
  },
})

export const {
  setApiCallStatus,
  removeApiCallStatus,
  clearApiCallStatus
} = splashApiCallsSlice.actions

export default splashApiCallsSlice.reducer
