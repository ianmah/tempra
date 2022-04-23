import React, { useState, useEffect, createRef } from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react'
import { useMutation, useLazyQuery } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import { create } from 'ipfs-http-client'
import Message from './Message'
import LitJsSdk from 'lit-js-sdk'
import { CREATE_POST_TYPED_DATA, SEARCH, GET_PUBLICATION, CREATE_COMMENT_TYPED_DATA, GET_PUBLICATIONS } from '../utils/queries'
import { ButtonIcon } from './Button'

const client = create('https://ipfs.infura.io:5001/api/v0')

const chain = 'mumbai'

const Container = styled.div`
  width: 600px;
  height: 80vh;
  position: relative;
`

const TextArea = styled.textarea`
    position: absolute;
    bottom: 0;
    left: 0;
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
    width: 100%;
    padding-bottom: 1em;
    color: #000;
    transition: all 100ms ease-in-out;
    &:focus {
        background: #ECE8FF;
    }
    border: 1px solid #eee;
`

const StyledButton = styled(ButtonIcon)`
  position: absolute;
  bottom: 3.5em;
  right: 0.5em;
`

function Content({ profile, wallet, convo, lensHub }) {
  // const [description, setDescription] = useState('')
  const inputRef = createRef();
  const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)
  const [mutateCommentTypedData, typedCommentData] = useMutation(CREATE_COMMENT_TYPED_DATA)
  const [messages, setMessages] = useState([])
  const [publicationId, setPublicationId] = useState('')

  const [searchPost, searchPostData] = useLazyQuery(SEARCH);
  const [getPub, getPubData] = useLazyQuery(GET_PUBLICATION);
  const [getPubs, getPubsData] = useLazyQuery(GET_PUBLICATIONS);

  //STEP 2
  useEffect(() => {
    console.log('fired step 2')
    if (!searchPostData.data) return;
    const filteredPosts = searchPostData.data.search.items.filter(pub => {
      return pub.__typename === 'Post'
    })

    console.log(filteredPosts[filteredPosts.length-1])

    if (filteredPosts[0]) {
      getPub({
        variables: {
            request: {
                publicationId: filteredPosts[filteredPosts.length-1].id
            },
        },
      })
    }
    if (messages.length > 0) return;

    if (searchPostData.data.search.items.length < 1) {
        return; 
    }

  }, [searchPostData.data]);

  //STEP 3
  useEffect(() => {
    console.log('fired step 3')
    if (!getPubData.data) return;
    const users = [profile.handle, convo.handle]
    users.sort()
    const query = `#${users.join('')}tmpr`

    setPublicationId(getPubData.data.publication.id)

    const firstMsg = getPubData.data.publication.metadata.content.replace(query, '')
    console.log(firstMsg)

    setMessages([{
      from: getPubData.data.publication.profile.handle,
      content: firstMsg,
      encoded: true,
    }])

    getPubs({
      variables: {
          request: {
              commentsOf: getPubData.data.publication.id
          },
      },
    })

  }, [getPubData.data]);


  //STEP 4
  useEffect(() => {
    console.log('fired step 4')
    if (!getPubsData.data) return;

    if (!getPubsData.data.publications.items) return;
    const users = [profile.handle, convo.handle]
    users.sort()
    const query = `#${users.join('')}tmpr`
    const commentContents = getPubsData.data.publications.items.map(comment => {
      // console.log(comment)
      return {
        from: comment.profile.handle,
        content: comment.metadata.content.replace(query, ''),
        createdAt: comment.createdAt,
        encoded: true,
      }
    })

    console.log(commentContents)
    setMessages([...messages, ...commentContents.reverse()])

  }, [getPubsData.data]);

  //STEP 1
  useEffect(() => {
    console.log('fired step 1')
    if (!convo.handle) return;
    setMessages([])

    const users = [profile.handle, convo.handle]
    users.sort()
    const query = `#${users.join('')}tmpr`

    getPub({
      variables: {
          request: {
              publicationId: '123'
          },
      },
    })
    
    searchPost({
        variables: {
            request: {
                query: query,
                type: "PUBLICATION",
            },
        },
      })

  }, [convo.handle] )

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

    // const ipfsResult = await client.add(JSON.stringify({
    //     name: 'Tempra Conversation',
    //     description: taggedDescription,
    //     content: taggedDescription,
    //     external_url: null,
    //     image: null,
    //     imageMimeType: null,
    //     version: "1.0.0",
    //     appId: 'tempra',
    //     attributes: [],
    //     media: [],
    //     metadata_id: uuidv4(),
    // }))

    console.log(postIpfsRes.path)

    // we check if this is a new conversation or continuing one
    if (messages.length > 0) {
      // continue convo
      console.log('continuing', publicationId)

      const createCommentRequest = {
          profileId: profile.id,
          publicationId,
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
      {convo.handle ? 
        <>
          <h2>{convo.handle}</h2>
          {/* {messages.map((message) => {
            console.log('hi')
                return message.content
          })} */}
          <Message messages={messages} walletAddress={profile.ownedBy} />

          <TextArea
            ref={inputRef}
            placeholder="New message"
            height={5}
            // onChange={e => setDescription(e.target.value)}
            />
          <StyledButton onClick={handleSubmit}>
            <PaperPlaneRight size={24} color='white' />
          </StyledButton>
        </> : 'Select a conversation'
      }
      
    </Container>
    
  );
}

export default Content;