import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useMutation } from '@apollo/client'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import { v4 as uuidv4 } from 'uuid';
import { create } from 'ipfs-http-client'
import Button from './Button'
import { CREATE_POST_TYPED_DATA } from '../utils/queries'


const client = create('https://ipfs.infura.io:5001/api/v0')

const axios = require('axios');


const Stories = ({ wallet, profile, lensHub }) => {
    const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)

    // Uploading Video
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState("");
    const [video, setVideo] = useState("")
    const [videoNftMetadata, setVideoNftMetadata] = useState({})

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

        console.log(data);

        // console.log("The nftmetadataURL ", data["nftMetadataGatewayUrl"])

        // Get metadata from livepeer
        const responseVidNftMetadata = await fetch(data["nftMetadataGatewayUrl"], { method: "GET" });
        const vidNftData = await responseVidNftMetadata.json();

        setVideoNftMetadata(vidNftData)
        console.log("VideoNFTMetaData :", vidNftData)

        setLoading(false)

        // console.log(data);
        // const ipfs = await fetch(`https://ipfs.io/${data.data.replace(":", "")}`);
        // const nftMetadata = await ipfs.json()
        // console.log(nftMetadata);
        // setVideo(`https://ipfs.io/${nftMetadata.properties.video.replace(":", "")}`)

    }

    const handleSubmit = async () => {
        const id = profile.id.replace('0x', '')

        var ipfsResult = "";

        if (videoNftMetadata) {
            ipfsResult = await client.add(JSON.stringify({
                name: videoNftMetadata["name"],
                description : "story",
                content: "story",
                external_url: null,
                // image: null,
                image: videoNftMetadata["image"],
                imageMimeType: null,
                version: "1.0.0",
                appId: 'iris',
                attributes: [],
                media: [{
                    item: videoNftMetadata["animation_url"],
                    type: "video/mp4"
                }],
                metadata_id: uuidv4(),
            }))
            // Sample file of a what it should look like
            // ipfsResult = await client.add(JSON.stringify({
            //     name,
            //     description,
            //     content: description,
            //     external_url: null,
            //     // image: null,
            //     image: "ipfs://bafkreidmlgpjoxgvefhid2xjyqjnpmjjmq47yyrcm6ifvoovclty7sm4wm",
            //     imageMimeType: null,
            //     version: "1.0.0",
            //     appId: 'iris',
            //     attributes: [],
            //     media: [{
            //         item: "ipfs://QmPUwFjbapev1rrppANs17APcpj8YmgU5ThT1FzagHBxm7",
            //         type: "video/mp4"
            //     }],
            //     metadata_id: uuidv4(),
            // }))

        }

        // hard coded to make the code example clear
        const createPostRequest = {
            profileId: profile.id,
            contentURI: 'ipfs://' + ipfsResult.path,
            collectModule: {
                revertCollectModule: true,
            },
            referenceModule: {
                followerOnlyReferenceModule: false,
            },
        };

        mutatePostTypedData({
            variables: {
                request: createPostRequest,
            }
        })
    }

    useEffect(() => {
        if (!typedPostData.data) return;

        const processPost = async () => {

            const typedData = typedPostData.data.createPostTypedData.typedData
            const { domain, types, value } = typedData

            const signature = await wallet.signer._signTypedData(
                omitDeep(domain, '__typename'),
                omitDeep(types, '__typename'),
                omitDeep(value, '__typename')
            )

            const { v, r, s } = utils.splitSignature(signature);

            const tx = await lensHub.postWithSig({
                profileId: typedData.value.profileId,
                contentURI: typedData.value.contentURI,
                collectModule: typedData.value.collectModule,
                collectModuleData: typedData.value.collectModuleData,
                referenceModule: typedData.value.referenceModule,
                referenceModuleData: typedData.value.referenceModuleData,
                sig: {
                    v,
                    r,
                    s,
                    deadline: typedData.value.deadline,
                },
            });
            console.log('create post: tx hash', tx.hash);
        }
        processPost()

    }, [typedPostData.data])

    return (
        <div>
            <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
            />
            <Button onClick={videoUpload}>Upload Story</Button>
        </div>
    )
}

export default Stories