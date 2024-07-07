import { createSlice } from '@reduxjs/toolkit'

export const passwordSlice = createSlice({
  name: 'passwords',
  initialState: {
    value: []
  },
  reducers: {
    passWordListUpdate: (state, action) => {
      state.value = action.payload
    }
  }
})

export const selectPasswords = (state) => state.passwords.value

export const { passWordListUpdate } = passwordSlice.actions

export default passwordSlice.reducer