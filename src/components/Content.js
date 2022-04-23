import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react'
import { ButtonIcon } from './Button'
import { SEARCH_POST } from '../utils/queries'

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

function Content({ convo }) {
  const [description, setDescription] = useState('')
  const [messages, setMessages] = useState([]);

  const searchData = useQuery(SEARCH_POST, {
    variables: {
        request: {
            query: "tempuraraavetmpr",
            type: "PUBLICATION",
        },
    },
  });

  useEffect(() => {
    if (!searchData.data) return;
    if (messages.length > 0) return;

    if (searchData.data.search.items.length < 1) {
        return;
    }

    setMessages(searchData.data.search.items);
  }, [searchData.data]);
    
  return (
    <Container>
      {convo.handle ? 
        <>
          <h2>{convo.handle}</h2>
          {messages.map((message) => {
                return message.id
            })}
          <TextArea
            value={description}
            placeholder="New message"
            height={5}
            onChange={e => setDescription(e.target.value)}
            />
          <StyledButton>
            <PaperPlaneRight size={24} color='white' />
          </StyledButton>
        </> : 'Select a conversation'
      }
      
    </Container>
    
  );
}

export default Content;
