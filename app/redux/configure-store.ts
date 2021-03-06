import {Action, compose, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit"
import { ThunkAction } from 'redux-thunk'

//Reactotron Imp For Debug Purpose

import rootReducer, {RootStateType} from "./root-reducers";

const middleware = getDefaultMiddleware({
    serializableCheck: false,
    thunk:{
        extraArgument:{ },
    }
})

const store = configureStore({
    reducer:rootReducer,
    middleware
})

export type AppDispatch = typeof store.dispatch
export type AppThunk = ThunkAction<void, RootStateType, unknown, Action<string>>

export default store
