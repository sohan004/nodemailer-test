import { RecaptchaVerifier, getAuth, signInWithPhoneNumber } from 'firebase/auth';
import React, { createContext } from 'react';
import app from './firebase.config';

export const contex = createContext(null)

const AuthContex = ({ children }) => {

    const auth = getAuth(app)

    const recaptcha = (num) => {
        const recaptchaVerifier = new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
            },
        );
        recaptchaVerifier.render()

        return signInWithPhoneNumber(auth, num, recaptchaVerifier)
    }


    const value = {
        recaptcha
    }
    return (
        <contex.Provider value={value}>
            {children}
        </contex.Provider>
    );
};

export default AuthContex;