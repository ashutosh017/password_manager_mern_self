import { createSlice } from '@reduxjs/toolkit'

export const formSlice = createSlice({
    name: 'updateForm',
    initialState: {
        value: {
            websiteUrl: '',
            username: '',
            password: ''
        }
    },
    reducers: {
        setUpdateFormState: (state, action) => {
            state.value = action.payload
        }
    }
})

export const selectUpdateFormData = (state) => state.updateForm.value

export const { setUpdateFormState } = formSlice.actions

export default formSlice.reducer