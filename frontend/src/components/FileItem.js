import React from 'react';
import axios from 'axios'
import fileDownload from 'js-file-download'
import { Card,Button } from 'react-bootstrap';
import {backendUrl} from '../utils/url'


const FileItem = ({ filename, userData,updateUserData }) => {

    const download = async () => {
        
        try {
            let res = await axios.get(`${backendUrl}/download/${userData.ID}/${filename}`)
            
            axios.get(res.data.url, {
                responseType: 'blob',
            })
                .then((res) => {
                    fileDownload(res.data, filename)
                })
        }
        catch (err) {
            //alert("hi")
            alert(err.response.data.data)
            console.log(err.response)
        }
    }

    const del =async()=>{
        try {
            await axios.delete(`${backendUrl}/${userData.ID}/${filename}`)
            
            axios.get(`${backendUrl}/home`).then(response => {
                updateUserData(response.data)
            })
        } catch (error) {
            alert(error.response.data.data)
            console.log(error.response)
        }
    }

    return (
        <div>
            <Card style={{ width: '20rem'}}>
                <Card.Img variant="top" src="https://picsum.photos/200" alt="hi"/>
                <Card.Body>
                    <Card.Title>{filename}</Card.Title>
                    <Button style={{margin:"0.2rem"}} variant="primary" onClick={del}>Delete</Button>
                    <Button
                    style={{margin:"0.2rem"}}
                    variant="primary"
                    onClick={download}
                    >
                    Download
                    </Button>
                </Card.Body>
            </Card>
            <br/>
        </div>
    )
}

export default FileItem;