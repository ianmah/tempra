 
import React, { useEffect, createRef } from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react'
import { useMutation } from '@apollo/client'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import Button, { ButtonIcon } from './Button'
import LitJsSdk from 'lit-js-sdk'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'ipfs-http-client'
import { CREATE_POST_TYPED_DATA, CREATE_COMMENT_TYPED_DATA } from '../utils/queries'
 
const client = create('https://ipfs.infura.io:5001/api/v0')
const Container = styled.div`
 
`
 
const TextArea = styled.textarea`
    position: absolute;
    bottom: 1em;
    left: 1em;
    border: none;
    border-radius: 6px;
    font-family: ${p => p.theme.font};
    overflow: auto;
    outline: none;
    padding: 0.3em;
    margin-bottom: 0.4em;
    padding-right: 4em;
 
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
 
    resize: none; /*remove the resize handle on the bottom right*/
    box-sizing: border-box;
    resize: none;
    font-size: 1em;
    height: ${p => p.height || 3}em;
    width: 670px;
    padding-bottom: 1em;
    color: #000;
    transition: all 100ms ease-in-out;
    &:focus {
        background: #fff;
    }
    border: 1px solid #eee;
`
 
const StyledButton = styled(ButtonIcon)`
  position: absolute;
  bottom: 4.5em;
  right: 1.4em;
`
 
const chain = 'mumbai'
 
function Textbox({ wallet, lensHub, profile, convo, isNew, pubId }) {
    const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)
    const [mutateCommentTypedData, typedCommentData] = useMutation(CREATE_COMMENT_TYPED_DATA)
 
    const inputRef = createRef()
 
    const handleSubmit = async () => {
        const description = inputRef.current.value
        if (!description) return;
        const id = profile.id.replace('0x', '')
        const users = [profile.handle, convo.handle]
        users.sort()
        const query = `#${users.join('')}tmpr`
       
        console.log({ id, description })
   
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
   
        const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
            description
        );
   
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
                  value: convo.ownedBy
              }
          },
          {"operator": "or"},
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
                  value: profile.ownedBy
              }
          }
      ]
 
        const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
            accessControlConditions,
            symmetricKey,
            authSig,
            chain,
        });
   
        const blobString = await encryptedString.text()
        console.log(JSON.stringify(encryptedString))
        console.log(encryptedString)
        const newBlob = new Blob([blobString], {
            type: encryptedString.type // or whatever your Content-Type is
        });
        console.log(newBlob)
        console.log(LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"))
   
        const ipfsResult = await client.add(encryptedString)
   
   
        const encryptedPost = {
            key: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16"),
            blobPath: ipfsResult.path,
        }
   
        const postIpfsRes = await client.add(JSON.stringify({
            name: 'Tempra Conversation',
            description: `litcoded}`,
            content: `${JSON.stringify(encryptedPost)} ${query}`,
            external_url: null,
            image: null,
            imageMimeType: null,
            version: "1.0.0",
            appId: 'tempra',
            attributes: [],
            media: [],
            metadata_id: uuidv4(),
        }))
   
        const taggedDescription = `${description} ${query}`
        console.log(taggedDescription)
   
        console.log(postIpfsRes.path)
   
        // we check if this is a new conversation or continuing one
        if (isNew) {
          // continue convo
   
          const createCommentRequest = {
              profileId: profile.id,
              publicationId: pubId,
              contentURI: 'ipfs://' + postIpfsRes.path,
              collectModule: {
                revertCollectModule: true,
              },
              referenceModule: {
                  followerOnlyReferenceModule: false,
              },
          };
   
          mutateCommentTypedData({
              variables: {
                  request: createCommentRequest,
              }
          })
   
        } else {
          // new convo
          console.log('new')
          const createPostRequest = {
              profileId: profile.id,
              contentURI: 'ipfs://' + postIpfsRes.path,
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
   
          console.log('created typed post data req')
        }
   
      }
 
 
    useEffect(() => {
        if (!typedPostData.error) return;
 
        console.log(typedPostData.error)
 
    }, [typedPostData.error])
 
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
 
    useEffect(() => {
    if (!typedCommentData.data) return;
 
    const processComment = async () => {
 
        const typedData = typedCommentData.data.createCommentTypedData.typedData
        const { domain, types, value } = typedData
 
        const signature = await wallet.signer._signTypedData(
            omitDeep(domain, '__typename'),
            omitDeep(types, '__typename'),
            omitDeep(value, '__typename')
        )
 
        const { v, r, s } = utils.splitSignature(signature);
 
        const tx = await lensHub.commentWithSig({
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
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
    processComment()
 
    }, [typedCommentData.data])
   
    return (
        <Container>
          <TextArea
            ref={inputRef}
            placeholder="New message"
            height={5}
            />
          <StyledButton onClick={handleSubmit}>
            <PaperPlaneRight size={24} color='white' />
          </StyledButton>
        </Container>
       
    );
}
 
export default Textbox;