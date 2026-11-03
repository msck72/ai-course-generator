import React, { createContext, useContext } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const AuthContext = createContext({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    loginWithRedirect: () => { },
    logout: () => { },
    isConfigured: false
});

const Auth0Bridge = ({ children }) => {
    const auth0 = useAuth0();
    return (
        <AuthContext.Provider value={{ ...auth0, isConfigured: true }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const domain = import.meta.env.VITE_AUTH0_DOMAIN;
    const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;

    const isConfigured = Boolean(
        domain && clientId && !domain.includes('YOUR_DOMAIN')
    );

    if (!isConfigured) {
        return (
            <AuthContext.Provider
                value={{
                    isAuthenticated: false,
                    isLoading: false,
                    user: null,
                    loginWithRedirect: () => {
                        alert('Auth0 is not configured yet.\nPlease set the VITE_AUTH0_DOMAIN and VITE_CUTH0_CLIENT_ID to the client/.env');
                    },
                    logout: () => { },
                    isCOnfigured: false,
                }}
            >
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientId}
            authorizationParams={{
                redirect_uri: window.location.origin
            }}
            cacheLocation="localstorage"
        >
            <Auth0Bridge>{children}</Auth0Bridge>
        </Auth0Provider>
    );
};