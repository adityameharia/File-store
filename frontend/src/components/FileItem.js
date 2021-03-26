import React from 'react';
import axios from 'axios'
import fileDownload from 'js-file-download'


const FileItem = ({ filename, id }) => {

    

    const download = async (e) => {
        e.preventDefault()
        try {
            let res = await axios.get(`download/${id}/${filename}`)
            axios.get(res.data.url, {
                responseType: 'blob',
            })
                .then((res) => {
                    fileDownload(res.data, filename)
                })
        }
        catch (err) {
            alert(err.response.data.data)
        }
    }

    return (
        <div>
            <br />
            <button onClick={download}>{filename}</button>
            <br />
        </div>
    )
}

export default FileItem;