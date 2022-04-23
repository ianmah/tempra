import React, { useState } from 'react'
import styled from 'styled-components'
import { NotePencil } from 'phosphor-react'
import Button, { ButtonIcon } from './Button'

const Container = styled.div`
    position: absolute;
    bottom: 0;
`

const StyledButton = styled(Button)`
    color: black;
    display: flex;
    align-items: center;
    background-color: white;
`

const ProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 2em;
`
function Compose({  }) {

    const handleClick = () => {
        console.log('click')
    }
    
    return (
        <Container>
            <StyledButton onClick={handleClick}>
            <NotePencil size={32} color='black' /> Start a new conversation
            </StyledButton>
        </Container>
        
    );
}

export default Compose;
