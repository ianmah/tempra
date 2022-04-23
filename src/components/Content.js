import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react'
import { CREATE_POST_TYPED_DATA, SEARCH, GET_PUBLICATION } from '../utils/queries'
import { useMutation, useLazyQuery, gql } from '@apollo/client'
import { v4 as uuidv4 } from 'uuid'
import { utils } from 'ethers'
import omitDeep from 'omit-deep'
import { ButtonIcon } from './Button'
import { create } from 'ipfs-http-client'

const client = create('https://ipfs.infura.io:5001/api/v0')

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
  const [description, setDescription] = useState('')
  const [mutatePostTypedData, typedPostData] = useMutation(CREATE_POST_TYPED_DATA)
  const [messages, setMessages] = useState([]);

  const [searchPost, searchPostData] = useLazyQuery(SEARCH);
  const [getPub, getPubData] = useLazyQuery(GET_PUBLICATION);

  useEffect(() => {
    if (!searchPostData.data) return;
    console.log(searchPostData.data.search.items[0])
    if (searchPostData.data.search.items[0]) {
      getPub({
        variables: {
            request: {
                publicationId: searchPostData.data.search.items[0].id
            },
        },
      })
    }
    if (messages.length > 0) return;

    if (searchPostData.data.search.items.length < 1) {
        return; 
    }

    setMessages(searchPostData.data.search.items);
  }, [searchPostData.data]);

  useEffect(() => {
    if (!getPubData.data) return;
    console.log(getPubData.data)

  }, [getPubData.data]);

  useEffect(() => {
    if (!convo.handle) return;

    const id = profile.id.replace('0x', '')
    const users = [profile.handle, convo.handle]
    users.sort()
    const query = `#${users.join('')}tmpr`
    
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
    if (!description) return;
    const id = profile.id.replace('0x', '')
    const users = [profile.handle, convo.handle]
    users.sort()
    const query = `#${users.join('')}tmpr`
    
    console.log({ id, description })

    const taggedDescription = `${description} ${query}`
    console.log(taggedDescription)

    const ipfsResult = await client.add(JSON.stringify({
        name: 'Tempra Conversation',
        description: taggedDescription,
        content: taggedDescription,
        external_url: null,
        image: null,
        imageMimeType: null,
        version: "1.0.0",
        appId: 'tempra',
        attributes: [],
        media: [],
        metadata_id: uuidv4(),
    }))

    console.log(ipfsResult.path)

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

    console.log('created tpyed post data req')

  }
  useEffect(() => {

      if (!typedPostData.error) return;
      
      console.log(typedPostData.error)

  }, [typedPostData.error])

  useEffect(() => {
    console.log('process post')
      if (!typedPostData.data) return;
      console.log('process post 2'  )

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
    <Container>
      {convo.handle ? 
        <>
          <h2>{convo.handle}</h2>
          {messages.map((message) => {
                return message.id
          })}
          content
          <TextArea
            value={description}
            placeholder="New message"
            height={5}
            onChange={e => setDescription(e.target.value)}
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
