import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'

const Profile = ({ profile, currProfile, handleClick }) => {
  return <div onClick={() => handleClick(profile)} selected={currProfile.id === profile.id}>
    <b>@{profile.handle}</b>
    <img/>
  </div>
}

function Wallet({ wallet, setWallet, authToken, currProfile, setProfile, setLensHub }) {
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES)
  const [openPicker, setPicker] = useState(false)

  useEffect(() => {
    if (!authToken || !wallet.address) return;

    getProfiles({
      variables: {
        request: {
          // profileIds?: string[];
          ownedBy: wallet.address
          // handles?: string[];
          // whoMirroredPublicationId?: string;
        },
      },
     })

  }, [authToken, wallet.address])

  useEffect(() => {
    if (!profiles.data) return
    console.log(profiles.data.profiles.items)

    // setProfile(profiles.data.profiles.items[0])

  }, [profiles.data])

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    const contract = new ethers.Contract('0x9BB30adbE65991A35B55839D98A66514b1c40f08', LensHub.abi, signer)
    setLensHub(contract)
  
    provider.getBalance(address).then((balance) => {
      const balanceInEth = ethers.utils.formatEther(balance)
      console.log({balanceInEth})
      setWallet({...wallet, signer, address, balanceInEth})
      })
  }

  useEffect(() => {
    connectWallet()
  }, [])
  
  return (
    
    <div>
    { !wallet.signer
    && <button onClick={connectWallet} >Connect Wallet</button>
    }
  </div>
  );
}

export default Wallet