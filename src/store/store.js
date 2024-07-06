import { configureStore } from '@reduxjs/toolkit'
import passwordReducer from './passwords/passwordslice'

export default configureStore({
    reducer: {
        passwords: passwordReducer
    }
})