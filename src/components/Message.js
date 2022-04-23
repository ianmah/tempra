import React, { useState } from 'react';
import styled from 'styled-components'
import LitJsSdk from 'lit-js-sdk'
import { create } from 'ipfs-http-client'
import { v4 as uuidv4 } from 'uuid'

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    font-size: 1rem;
    max-width: 600px;
    padding: 0.5rem 1.5rem;
`

const MessageBubbleSelf = styled.div`
    display: flex;
    border-radius: 1.15rem;
    line-height: 1.25;
    max-width: 75%;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;
    align-self: flex-end;
    background-color: #7329F0;
    color: #fff;
    margin: 0.25rem 0 0;
    width: fit-content;
    &:before {
        border-bottom-left-radius: 0.8rem 0.7rem;
        border-right: 1rem solid #248bf5;
        right: -0.35rem;
        transform: translate(0, -0.1rem);
    }
    &:after {
        background-color: #fff;
        border-bottom-left-radius: 0.5rem;
        right: -40px;
        transform:translate(-30px, -2px);
        width: 10px;
    }
`

const MessageBubbleThem = styled.div`
    display: flex;
    border-radius: 1.15rem;
    line-height: 1.25;
    max-width: 75%;
    padding: 0.5rem .875rem;
    position: relative;
    word-wrap: break-word;
    align-items: flex-start;
    background-color: #e5e5ea;
    color: #000;
    margin: 0.25rem 0 0;
    width: fit-content;
    &:before {
        border-bottom-right-radius: 0.8rem 0.7rem;
        border-left: 1rem solid #e5e5ea;
        left: -0.35rem;
        transform: translate(0, -0.1rem);
    }
    &:after {
        background-color: #fff;
        border-bottom-right-radius: 0.5rem;
        left: 20px;
        transform: translate(-30px, -2px);
        width: 10px;
    }
`

const client = create('https://ipfs.infura.io:5001/api/v0')
const chain = 'mumbai'


function Message ({ msg, walletAddress}) {
    const [txt, setTxt] = useState('')

    if (msg.encoded) {
        const encryptedPost = JSON.parse(msg.content);

        const accessControlConditions = [
            {
                contractAddress: '',
                standardContractType: '',
                chain,
                method: '',
                parameters: [
                    ':userAddress',
                ],
                returnValueTest: {
                    comparator: '=',
                    value: walletAddress
                }
            }
        ];

        const isthisblob = client.cat(encryptedPost.blobPath);
        let newEcnrypt;
        const doThing = async () => {
            const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

            for await (const chunk of isthisblob) {
                newEcnrypt = new Blob([chunk], {
                    type: "encryptedString.type", // or whatever your Content-Type is
                });
            }
            const key = await window.litNodeClient.getEncryptionKey({
                accessControlConditions,
                // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
                toDecrypt: encryptedPost.key,
                chain,
                authSig,
            });

            try {
                const decryptedString = await LitJsSdk.decryptString(newEcnrypt, key);
                setTxt(decryptedString);
            } catch (err) {
                console.log(err)
            }

        }
        doThing() 
        console.log('did thing')
    }

    return (
        <p>{txt || msg.content}</p>
    )

}

function Messages({ messages, selfHandle, walletAddress }) {
    return (
        <Wrapper>
            { messages.map(msg => {
                    
                return <Message walletAddress={walletAddress} key={uuidv4()} msg={msg} />

                // if (msg.from === selfHandle) {
                //     return <MessageBubbleSelf key={msg.createdAt}>
                //         <p>{msg.content}</p>
                //     </MessageBubbleSelf>
                // } else {
                //     return <MessageBubbleThem key={msg.createdAt}>
                //         <p>{msg.content}</p>
                //     </MessageBubbleThem>
                // }
            })}
        </Wrapper>
        
    );
};

export default Messages;