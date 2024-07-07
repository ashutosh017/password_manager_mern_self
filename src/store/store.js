import { configureStore } from '@reduxjs/toolkit'
import passwordReducer from './passwords/passwordslice'
import updateFormReducer from './passwords/updateFormSlice'

export default configureStore({
    reducer: {
        passwords: passwordReducer,
        updateForm: updateFormReducer
    }
})