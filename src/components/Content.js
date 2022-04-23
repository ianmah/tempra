import React, { useState } from 'react'
import styled from 'styled-components'
import { PaperPlaneRight } from 'phosphor-react'
import { ButtonIcon } from './Button'

const Container = styled.div`
  width: 600px;
`

const TextArea = styled.textarea`
    border: none;
    border-radius: 6px;
    font-family: ${p => p.theme.font};
    overflow: auto;
    outline: none;
    padding: 0.3em;
    margin-bottom: 0.4em;
  
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

function Content({ convo }) {
  const [description, setDescription] = useState('')
    
  return (
    <Container>
      {convo.handle ? 
        <>
          <h2>{convo.handle}</h2>
          content
          <TextArea
            value={description}
            placeholder="New message"
            height={5}
            onChange={e => setDescription(e.target.value)}
            />
          <ButtonIcon>
            <PaperPlaneRight size={32} color='white' />
          </ButtonIcon>
        </> : 'Select a conversation'
      }
      
    </Container>
    
  );
}

export default Content;
