import React, { useState } from 'react';
import { useGoogleLogin } from 'react-google-login';
import { useHistory } from 'react-router-dom';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader-spinner";
import { refreshTokenSetup } from '../utils/refreshToken';
import setToken from '../utils/setToken'
import FileItem from './FileItem'
import NavbarCustom from '../layout/Navbar'
import axios from 'axios';
import styled from "styled-components"
import Draggable from 'react-draggable';
import { Plus } from 'react-bootstrap-icons';


const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
    flex-wrap:wrap;
	font-size: 1.5rem;
	justify-content: space-evenly;
	align-items: center;
	background-color: white;
	font-family: Raleway, sans-serif;
	padding: 1em;
`

const clientId ='707788443358-u05p46nssla3l8tmn58tpo9r5sommgks.apps.googleusercontent.com';

const Loading = () => (
    <div style={{
         display: 'flex',
        flexDirection: "row",
    }}>
        Uploading &nbsp;<Loader type="ThreeDots" color="#00BFFF" height={30} width={30} />
    </div>
)

function LoginHooks() {

    let history = useHistory();

    const toastId = React.useRef(null);
    
    let [loading, setLoading] = useState(true)
    let [userData, setUserData] = useState(null)
    let [uploading,setUploading]=useState(false)
    let [isAuth,setIsAuth]=useState(false)


    const changeHandler = async(event) => {

        if (event.target.files[0] == undefined)
            return
        

        const data = new FormData()
        data.append('file', event.target.files[0])
        

        if (userData.files.includes(event.target.files[0].name)) {
            alert("a file with the given name already exists")
            return
        }

        try {
            setUploading(true)
            toastId.current = toast(<Loading />);
            await axios.post("/upload", data)
            toast.dismiss(toastId.current);
            setUploading(false)
            axios.get('/home').then(response => {
                setUserData(response.data)
            })

            alert("uploaded")

        }
        catch (err) {
            alert(err.response.data.data)
            console.log(err)
        }
    };

    const onSuccess = async (res) => {
        setIsAuth(true)

        setToken(res.tokenId)
        try {
            let response = await axios.get('/home')
            setUserData(response.data)
            refreshTokenSetup(res);
            setLoading(false);
        }
        catch (err) {
            alert(err.response.data.data)
            console.log(err)
            history.push('/login')
        }
    };

    const updateUserData = (data) => {
        console.log(data)
        setUserData(data)
    }

    const onAutoLoadFinished = (res) => {
        console.log(res)
        if (res === false)
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
            </div>) :
                (
                    <div>
                        <NavbarCustom isAuth={isAuth}/>
                        {!uploading && <Draggable>
                            <div style={{
                                position: 'fixed',
                                zIndex:'50',
                                alignItems: 'center',
                                justifyContent: 'center',
                                top: '90%',
                                left: '94%',
                                width: 20,
                                height: 20,
                                backgroundColor: '#fff',
                                borderRadius: 50,
                            }}>
                                <label style={{height:'20rem' }} htmlFor="files"><Plus color="royalblue" size={60}/></label>
                                <input
                                    id="files"
                                    style={{
                                        display: "none",
                                        visibility: "none",

                                    }} type="file" name="file" onChange={changeHandler} />
                            </div></Draggable>}

                        <div>
                            <Wrapper>
                                {
                                    userData !== null && userData.files.map((f) => (
                                        <FileItem key={f} filename={f} userData={userData} updateUserData={updateUserData} />))

                                }
                            </Wrapper>
                        </div>
                        <ToastContainer
                            position="bottom-right"
                            autoClose={false}
                            hideProgressBar={true}
                            draggable />
                    </div>
                )}


        </div>
    );
}

export default LoginHooks;