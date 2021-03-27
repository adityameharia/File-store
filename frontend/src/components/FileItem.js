import React from 'react';
import axios from 'axios'
import fileDownload from 'js-file-download'
import { Card,Button } from 'react-bootstrap';


const FileItem = ({ filename, userData,updateUserData }) => {

    const download = async () => {
        
        try {
            let res = await axios.get(`download/${userData.ID}/${filename}`)
            axios.get(res.data.url, {
                responseType: 'blob',
            })
                .then((res) => {
                    fileDownload(res.data, filename)
                })
        }
        catch (err) {
            alert(err.response.data.data)
            console.log(err)
        }
    }

    const del =async()=>{
        try {
            let r=await axios.delete(`${userData.ID}/${filename}`)
            console.log(r)
            axios.get('/home').then(response => {
                updateUserData(response.data)
            })
        } catch (error) {
            alert(error.response.data.data)
            console.log(error)
        }
    }

    return (
        <div>
            <Card>
                <Card.Img variant="top" src="holder.js/100px160" alt="hi"/>
                <Card.Body>
                    <Card.Title>{filename}</Card.Title>
                    <Button variant="primary" onClick={del}>Delete</Button>
                    <Button
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