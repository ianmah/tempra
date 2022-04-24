import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useLazyQuery } from '@apollo/client'
import Modal from './Modal'
import { GET_TIMELINE } from '../utils/queries'

const Container = styled.div`
    height: 80px;
    position: relative;
`

const ProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 5em;
    
    border: 4px solid #E13F04;
`

const AddStory = styled.div`
    width: 4em;
    &:hover {
        cursor: pointer;
    }
`

const Add = styled.span`
    position: absolute;
    background: ${p => p.theme.gradient};
    color: white;
    font-weight: 500;
    font-size: 12px;
    border-radius: 60px;
    bottom: 0.9em;
    left: 4.2em;
    padding: 0.2em 0.6em;
`;

function Stories({ profile = {} }) {
    const [getTimeline, getTimelineData] = useLazyQuery(GET_TIMELINE)
    const [modalOn, setModalOn] = useState(false)

    useEffect(() => {
        getTimeline({
            variables: {
                request: {
                    profileId: profile.id,
                },
            }
        })
    }, [])

    useEffect(() => {
        if (!getTimelineData.data) return;
        console.log(getTimelineData.data.timeline.items.filter((post) => {
            return post.metadata.description === 'ephemeraaal'
        }))

    }, [getTimelineData.data])


    const handleAdd = () => {
        setModalOn(true)
    }

    return (
        <Container>
            { modalOn && <Modal onExit={() => setModalOn(false)}>
                    hi!
                </Modal>
            }
            {
                profile.picture && <AddStory onClick={handleAdd} >
                    <ProfileIcon src={profile.picture.original.url} />
                    <Add>+</Add>
                </AddStory>
            }
            
        </Container>
        
    );
}

export default Stories;
