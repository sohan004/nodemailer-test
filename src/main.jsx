import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import AuthContex from './authContex.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContex>
      {/* <GoogleOAuthProvider clientId='25373434296-busjiu3bjnq04o646d0qp81tk426rg1p.apps.googleusercontent.com'> */}
        <App />
      {/* </GoogleOAuthProvider> */}

    </AuthContex>
  </React.StrictMode>,
)
