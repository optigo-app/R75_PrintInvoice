import { configureStore } from "@reduxjs/toolkit";
import factory from "./slices/FactoryApi";


export const store = configureStore({
    reducer: factory
})

export default store;