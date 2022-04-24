import React, { useEffect } from 'react'
import { ethers } from 'ethers'
import { useLazyQuery } from '@apollo/client'
import { GET_PROFILES } from '../utils/queries'
import LensHub from '../abi/LensHub.json'
import Web3Modal from "web3modal";
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import WalletConnectProvider from "@walletconnect/web3-provider";
import Button from './Button'
import styled, { withTheme } from 'styled-components'




function Wallet({ wallet, setWallet, authToken, setProfiles, setLensHub }) {
  const [getProfiles, profiles] = useLazyQuery(GET_PROFILES)
  const ButtonIcon = styled(Button)`
    width: 344px;
    height: 46px;
    padding: 10px 16px;
    background: #000000;
    box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.08);
    border-radius: 3px;
    color: white;
    :hover {
      background: black;
    }
    `

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
      },
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          infuraId: "872482339df04cbd8e9867db362e6cc4" // required
        }
      }
    };
    
    const web3Modal = new Web3Modal({
      network: "mumbai", // optional
      cacheProvider: true, 
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
    && <ButtonIcon onClick={connectWallet} >Connect Wallet</ButtonIcon>
    }
  </div>
  );
}

export default Wallet