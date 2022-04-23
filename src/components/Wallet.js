import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';

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
    const providerOptions = {
      coinbasewallet: {
        package: CoinbaseWalletSDK, // Required
        options: {
          appName: "Tempra", // Required
          infuraId: "872482339df04cbd8e9867db362e6cc4", // Required
          rpc: "", // Optional if `infuraId` is provided; otherwise it's required
          chainId: 1, // Optional. It defaults to 1 if not provided
          darkMode: false // Optional. Use dark theme, defaults to false
        }
      }
    };
    
    const web3Modal = new Web3Modal({
      network: "polygonmumbai", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });
    const instance = await web3Modal.connect();

    const provider = new ethers.providers.Web3Provider(instance)
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