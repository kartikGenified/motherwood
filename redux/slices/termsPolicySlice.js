import { createSlice } from '@reduxjs/toolkit'

const initialState = {
 terms:"",
 policy:"",
 about:"",
 details:""
  
}

export const termsPolicySlice = createSlice({
  name: 'termsPolicy',
  initialState,
  reducers: {
    
    
    setTerms: (state, action) => {
        state.terms = action.payload
      },
    setPolicy:(state,action)=>{
        state.policy = action.payload
      },
      setAbout:(state,action)=>{
        state.about = action.payload

      },
      setDetails:(state,action)=>{
        state.details = action.payload
      },
    setAllLegal:(state, action) => {
        state.terms = action.payload.terms
        state.policy = action.payload.policy
        state.about = action.payload.about
        state.details = action.payload.details
      },
  },
})

// Action creators are generated for each case reducer function
export const { setTerms,setPolicy, setAbout, setDetails, setAllLegal } = termsPolicySlice.actions

export default termsPolicySlice.reducer