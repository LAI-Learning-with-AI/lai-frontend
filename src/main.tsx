import React from 'react'
import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* enable sitewide Auth0 provider */}
    <Auth0Provider
      domain={import.meta.env.AUTH0_DOMAIN}
      clientId={import.meta.env.AUTH0_CLIENTID}
      authorizationParams={{
        redirect_uri: import.meta.env.AUTH0_CALLBACK,
      }}
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>,
)
