import { createContext } from 'react'

// default context for user
const defaultContext = {
        user: null,
        setUser: () => {},
}

// we can use 'UserContext' in any part of the app to access defaultContext (our global state)
export const UserContext = createContext(
    defaultContext
);