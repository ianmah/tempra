import React, { createRef } from 'react'
import styled from "styled-components"

const ModalContainer = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    z-index: 1000;
    background-color: rgba(225, 63, 4, 0.1);
    backdrop-filter: blur(4px);
`

const StyledCard = styled.div`
    z-index: 1005;
    width: 500px;
    height: 400px;
    margin: auto;
    margin-top: 10vh;  
    padding: 2em;
    background: white;
    border-radius: 2em;
`

const Modal = ({ children, onExit }) => {
    const ref = createRef()
    return (
        <ModalContainer ref={ref} onClick={(e) => {
            if (e.target === ref.current) {
                onExit()
            }
        }
        }
            >
            <StyledCard>
                { children }
            </StyledCard>
        </ModalContainer>
    )
}

export default Modal