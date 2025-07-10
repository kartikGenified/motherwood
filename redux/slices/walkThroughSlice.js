import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  stepId:1,
  isAlreadyWalkedThrough:false,
  walkThroughCompleted:false
}

export const walkThroughSlice = createSlice({
  name: 'walkThrough',
  initialState,
  reducers: {
    setStepId: (state, action) => {
      console.log("stepId",action.payload)
      state.stepId = action.payload
    },
    setAlreadyWalkedThrough: (state, action) => {
        console.log("isAlreadyWalkedThrough",action.payload)
        state.isAlreadyWalkedThrough = action.payload
      },
      setWalkThroughCompleted: (state, action) => {
        console.log("setWalkThroughCompleted",action.payload)
        state.walkThroughCompleted = action.payload
      },
  },
})

// Action creators are generated for each case reducer function
export const {setStepId,setAlreadyWalkedThrough,setWalkThroughCompleted} = walkThroughSlice.actions

export default walkThroughSlice.reducer