import React, { useState } from 'react'
import styled from 'styled-components'

const Picker = styled.div`
`

export const ProfileIcon = styled.img`
    height: 3em;
    width: 3em;
    border-radius: 2em;
    margin-right: 0.4em;
`

const MyProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 2em;
    margin-right: 0.4em;
`

const ProfileContainer = styled.div` 
  border-bottom: 1px solid #e1e1e1;
  padding: 1em;
  display: flex;
`

function ProfilePicker({ profiles }) {
    
  return (
    <Picker>
    {
        profiles.map(profile => {
            return <ProfileContainer key={profile.id}>
                <MyProfileIcon src={profile.picture.original.url} key={profile.id}/>
                <h2>@{profile.handle}</h2>
            </ProfileContainer>
        })
    }
    </Picker>
    
  );
}

export default ProfilePicker;
