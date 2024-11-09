import { applyMiddleware, combineReducers, configureStore, createStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { userSlice } from './reducers/userReducer';

const rootReducer = combineReducers({
    user: userSlice.reducer,
    // Add other reducers here if needed
});

// Configuration object for redux-persist
// Specifies the storage engine and the key for the root level of the state tree
const persistConfig = {
    key: 'Pseudorandom Number Generators',
    storage: AsyncStorage,
};

// Create a persisted reducer using the persistConfig and rootReducer
// This persisted reducer will be used to create the Redux store
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store with the persisted reducer and apply middleware
// Here we are using createStore to create the store and apply middleware if any

// export const store = createStore(persistedReducer, applyMiddleware());

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            thunk: {
                extraArgument: { API_URL: '', token: 'your_token' } // Optionally pass extra arguments
            },
            serializableCheck: false,
        }),
});


// Create a persistor which is used to persist the store
// Persistor will be used in the application to gate the rehydration process
export const persistor = persistStore(store);