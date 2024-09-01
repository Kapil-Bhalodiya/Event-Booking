import React from "react";
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { AUTH_CLIENT_ID, BACKEND_COMMON } from '../../config';
import { useUser } from '../context/AuthContext';

export default function GoogleAuth() {
    const { login } = useUser();
    const naviagte = useNavigate();
    const handleGoogleResponse = async (response) => {
        console.log("handleGoogleResponse : ", response);
        if (response.error) {
            console.error("Google Login Error:", response.error);
            return;
        }
        const idToken = response.credential;
        try {
            const res = await fetch(`${BACKEND_COMMON}/auth/google/token`, {
                method: 'POST',
                body: JSON.stringify({ idToken }),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            console.log("google auth : ", data);
            login(data);
            naviagte('/');
        } catch (error) {
            console.log("catch auth error : ", error);
        }
    }

    return (
        <React.Fragment>
            <div className="separator">OR CONTINUE WITH</div>
            <GoogleOAuthProvider clientId={AUTH_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleGoogleResponse}
                    onFailure={handleGoogleResponse}
                    logo="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                    style={{ margin: '8px' }}
                />
            </GoogleOAuthProvider>
        </React.Fragment>
    )
}