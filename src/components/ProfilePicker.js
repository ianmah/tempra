import React, { useState } from 'react'
import styled from 'styled-components'

const Picker = styled.div`
`

export const ProfileIcon = styled.img`
    height: 4em;
    width: 4em;
    border-radius: 2em;
`

function ProfilePicker({ profiles }) {
    
  return (
    <Picker>
    {
        profiles.map(profile => {
            return <div key={profile.id}>
                <ProfileIcon src={profile.picture.original.url} key={profile.id}/>
            </div>
        })
    }
    </Picker>
    
  );
}

export default ProfilePicker;
