import React, { useState } from 'react'
import styled from 'styled-components'
import { NotePencil } from 'phosphor-react'
import { ButtonIcon } from './Button'

const Container = styled.div`

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
            <ButtonIcon onClick={handleClick}>
                <NotePencil size={32} color='white' />
            </ButtonIcon>
        </Container>
        
    );
}

export default Compose;
