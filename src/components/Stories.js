import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useQuery } from '@apollo/client'
import Button, { ButtonIcon } from './Button'
import { GET_TIMELINE } from '../utils/queries'

const Container = styled.div`
    height: 80px;
`

const ProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 2em;
    border: 1px solid;
    border-image-source: linear-gradient(189.15deg, #F6C005 0.58%, #F87383 49.27%, #726FFF 100%);
`

function Stories({ profile = {} }) {
    // const { loading, error, data } = useQuery(GET_TIMELINE, {
    //     variables: {
    //         request: {
    //             profileId: profile.id,
    //         },
    //     },
    // });

    // useEffect(() => {

    //     console.log(data.timeline.items.filter((post) => {
    //         return post.metadata.description === 'ephemeraaal'
    //     }))


    // }, [data])
    
    return (
        <Container>
            <ProfileIcon/>
        </Container>
        
    );
}

export default Stories;
