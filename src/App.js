import React, {useEffect, useState} from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

// Constants
const TWITTER_HANDLE = 'cloak777';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {

const [currentAccount, setCurrentAccount] = useState(null); //state to store users wallet
  const checkIfWalletConnected = async () => {
try {

  const { ethereum } = window;

if(ethereum) {
console.log("You have metamask, all good!",  ethereum);

const accounts = await ethereum.request({method: 'eth_accounts'});

if (accounts.length !== 0) {
  const account = accounts[0];
  console.log("Found a valid metamask account!", account)
  setCurrentAccount(account);
}
} else {
console.log("No authorised account here! ")
}
}
catch (error) {
  console.log("Yikes! We have an error", error)
}
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (ethereum) {
        const accounts = await ethereum.request({method:'eth_requestAccounts'})
        console.log("All the accounts", accounts)

        const account = accounts[0]

        setCurrentAccount(account);
        console.log("Connected to account", account)
      }
    }
    catch (error) {
      console.log("error in conencting")
    }
  }


  useEffect (() => {

    checkIfWalletConnected();
  }, [])
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">⚔️ Pikachu And The Legends Of The Multiverse ⚔️</p>
          <p className="sub-text">Legendary Pokemon unite to save the Multiverse from it's creator, Arceus!</p>
          <div className="connect-wallet-container">
            <img
              src="https://64.media.tumblr.com/tumblr_mbia5vdmRd1r1mkubo1_500.gifv"
              alt="Monty Python Gif"
            />
              <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect Wallet To Get Started
            </button>
          </div>
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
