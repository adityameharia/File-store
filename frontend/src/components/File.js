import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { refreshTokenSetup } from '../utils/refreshToken';

import NavbarCustom from '../layout/Navbar'

const clientId =

    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';



function LoginHooks() {

    let history = useHistory();

    let [loading, setLoading] = useState(true)

    const onSuccess = (res) => {
        setLoading(false)
        refreshTokenSetup(res);
        console.log(res);
    };

    const onAutoLoadFinished = (res) => {
        if (res == false)
            history.push('/login')
    }

    useGoogleLogin({
        onSuccess,
        onAutoLoadFinished,
        clientId,
        isSignedIn: true,
        cookiePolicy: 'single_host_origin'
    });

    return (
        <div>
            {loading ? (<div style={{ textAlign: "center", padding: "2rem" }}>
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={100}
                        width={100}
                    />
                </div>):(<NavbarCustom />)}
        </div>
    );
}

export default LoginHooks;