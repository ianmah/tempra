import React from "react";

const axios = require('axios');

function Stories() {
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [video, setVideo] = useState("")

    const videoUpload = async () => {
        const formData = new FormData();
        console.log(selectedFile)
        formData.append(
            "fileName",
            selectedFile,
            selectedFile.name
        );

        setLoading(true)
        const response = await fetch('http://localhost:3001/upload', { method: "POST", body: formData, mode: "cors" });
        const data = await response.json();

        setLoading(false)

        console.log(data);

        // console.log(data);
        // const ipfs = await fetch(`https://ipfs.io/${data.data.replace(":", "")}`);
        // const nftMetadata = await ipfs.json()
        // console.log(nftMetadata);
        // setVideo(`https://ipfs.io/${nftMetadata.properties.video.replace(":", "")}`)

    }

    return
}

export default Stories;