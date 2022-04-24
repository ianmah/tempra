import React, { useState, useEffect, createRef } from 'react'
import styled, { withTheme } from 'styled-components'
import bg from '../assets/bg.png'
import Button from '../components/Button'
import Wallet from '../components/Wallet'
import textlogo from '../assets/textlogo.png'

const LandingStyle = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    background: url(${bg});
    background-size: cover;
`
const Logo = styled.div`
    width: 517.29px;
    height: 173px;
    position: absolute;
    display: flex;
`
const Title = styled.div`
    font-weight: 600;
    font-size: 8em;
    color: #220D6D;
    display: flex;
    float: left;
    padding: 10px;
`
const Subtitle = styled.div`
    font-weight: 500;
    font-size: 3em;
    color: #000000;
    display: flex;
    padding: 5px;
`
const Body = styled.div`
    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const Center = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 2em;
    flex-direction: column;
`
const Row = styled.div`
    flex-direction: row;
`

function Landing({ wallet, setWallet, authToken, setProfiles, setLensHub }) {
    return (
        <LandingStyle>
            <Body>
                <Center>
                    <Subtitle>Welcome to</Subtitle>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Logo><img src={textlogo}></img></Logo>
                    <br></br>
                    <br></br>
                    <br></br>
                    <Wallet wallet={wallet} setWallet={setWallet} setLensHub={setLensHub} authToken={authToken} setProfiles={setProfiles}/>
                </Center>
            </Body>
        </LandingStyle>
    );
}


export default Landing 