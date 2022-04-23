import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { GET_FOLLOWING } from '../utils/queries'
import { useLazyQuery } from '@apollo/client'
import Compose from './Compose'
import { ProfileIcon } from './ProfilePicker'

const Wrapper = styled.div`
    width: 300px;
    background: #fafafa;
`

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
`

function Sidebar({ wallet, setConvo }) {
    const [getFollowing, getFollowingData] = useLazyQuery(GET_FOLLOWING); 
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        if (!wallet.address) return;
        getFollowing({
            variables: {
                request: {
                    address: wallet.address,
                },
            },
        })
    }, [wallet.address])

    useEffect(() => {
        if (!getFollowingData.data) return;
        // console.log(getFollowingData.data.following.items)
        setProfiles(getFollowingData.data.following.items)
    }, [getFollowingData.data])
    
    return (
        <Wrapper>
            <Compose/>
            {
                profiles.map((item) => {
                    console.log(item.profile)
                    return <ProfileContainer key={item.profile.id} onClick={() => setConvo(item.profile)} >
                        <ProfileIcon src={item.profile.picture.original.url} />
                        <p>{item.profile.handle}</p>
                    </ProfileContainer>
                })
            }
        </Wrapper>
        
    );
}

export default Sidebar;
