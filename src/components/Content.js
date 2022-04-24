import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/client'
import Message from './Message'
import { CREATE_POST_TYPED_DATA, SEARCH, GET_PUBLICATION, CREATE_COMMENT_TYPED_DATA, GET_PUBLICATIONS } from '../utils/queries'
import TextBox from './TextBox'

const Container = styled.div`
  width: 660px;
  height: 75vh;
  padding: 1em;
  background: #f9f9f9;
  position: relative;
  border-radius: 1em;
  margin-right: 1em;
  box-shadow: 0px 2px 12px rgba(112, 111, 111, 0.3);
`

function Content({ profile, wallet, convo, lensHub }) {
  const [messages, setMessages] = useState([])
  const [firstPost, setFirstPost] = useState({})
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

    // setMessages([{
    //   from: getPubData.data.publication.profile.handle,
    //   content: firstMsg,
    //   encoded: true,
    // }])

    setFirstPost({
        from: getPubData.data.publication.profile.handle,
        content: firstMsg,
        encoded: true,
    })

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
    setMessages([firstPost, ...commentContents.reverse()])

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
    
  return (
    <Container>
      {convo.handle ? 
        <>
          <h2>{convo.handle}</h2>
          {/* {messages.map((message) => {
            console.log('hi')
                return message.content
          })} */}
          <Message messages={messages} walletAddress={profile.ownedBy} selfHandle={profile.handle} senderAddress={convo.ownedBy}/>

          <TextBox wallet={wallet} lensHub={lensHub} convo={convo} profile={profile} pubId={publicationId} isNew={messages.length > 0} />
        </> : 'Select a conversation'
      }
      
    </Container>
    
  );
}

export default Content;