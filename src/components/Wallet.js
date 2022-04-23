import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'

function Wallet({ wallet, setWallet, authToken, setProfiles, setLensHub }) {
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES)

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

    setProfiles(profiles.data.profiles.items)

  }, [profiles.data])

  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner()
    const address = await signer.getAddress()

    const contract = new ethers.Contract('0x4BF0c7AD32Fd2d32089790a54485e23f5C7736C0', LensHub, signer)
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