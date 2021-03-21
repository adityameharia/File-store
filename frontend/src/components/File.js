import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import { refreshTokenSetup } from '../utils/refreshToken';
import setToken from '../utils/setToken'

import NavbarCustom from '../layout/Navbar'
import axios from 'axios';

const clientId =

    '707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';



function LoginHooks() {

    let history = useHistory();
    
    let [filename,setFileName]=useState()
    let [loading, setLoading] = useState(true)
    let [selectedFile, setSelectedFile] = useState();
    let [isFilePicked, setIsFilePicked] = useState(false);
    let [userData, setUserData] = useState()

    const changeHandler = (event) => {      
        if(event.target.files[0]!=undefined)  
        setFileName(event.target.files[0].name)
        setSelectedFile(event.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = async (e) => {
        e.preventDefault()
        
        if (!isFilePicked) {
            console.log("pick file pls")
            return
        }

        const data = new FormData()
        data.append('file', selectedFile)        

        if(userData.files.includes(filename)){
            alert("a file with the given name already exists")
            return
        }

        try {
            let res = await axios.post("/upload", data)
            axios.get('/home').then(response=>{
                setUserData(response.data)  
            })
            
            alert("uploaded")
            
        }
        catch(err){
            console.log(err)
        }
    };

    const onSuccess = async (res) => {

        setToken(res.tokenId)
        try {
            let response = await axios.get('/home')
            
            setLoading(false)
            refreshTokenSetup(res);
            setUserData(response.data)

        }
        catch (err) {
            alert(err.response.data.data)

            history.push('/login')
        }
    };

    const onAutoLoadFinished = (res) => {
        console.log(res)
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
            </div>) : (<div><NavbarCustom /><input type="file" name="file" onChange={changeHandler} />
                <div>
                    <button onClick={handleSubmission}>Submit</button>
                </div></div>)}
        </div>
    );
}

export default LoginHooks;