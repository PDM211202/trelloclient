import { configureStore } from '@reduxjs/toolkit'
import trelloReducer from './reducer/trelloReducer'

export const store = configureStore({
    reducer: {
        trelloReducer: trelloReducer
    },
})