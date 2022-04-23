import React, { useState } from 'react'
import styled from 'styled-components'
import { NotePencil } from 'phosphor-react'
import Button from './Button'

const Container = styled.div`

`

const ProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 2em;
`

const StyledButton = styled(Button)`
    width: 50px;
    padding: 0.4em 0.1em;
`

function Compose({  }) {

    const handleClick = () => {
        console.log('click')
    }
    
    return (
        <Container>
            <StyledButton onClick={handleClick}>
                <NotePencil size={32} color='white' />
            </StyledButton>
        </Container>
        
    );
}

export default Compose;
