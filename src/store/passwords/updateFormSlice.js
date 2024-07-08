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
        },
        clearUpdateFormState: (state) => {
            state.value = {
                websiteUrl: '',
                username: '',
                password: ''
            }
        }
    }
})

export const selectUpdateFormData = (state) => state.updateForm.value

export const { setUpdateFormState, clearUpdateFormState } = formSlice.actions

export default formSlice.reducer