import React, { useEffect, useState } from "react";
import twitterLogo from "./assets/twitter-logo.svg";
import opensealogo from "./assets/opensea.png";
import rariblelogo from "./assets/rarible.jpeg";
import "./App.css";
import SelectPokemon from "./Components/SelectPokemon/SelectPokemon";
import { CONTRACT_ADDRESS, transformPokemonData } from "./constants";
import pokemonNFTGame from "./utils/PokemonNFTGame.json";
import { ethers } from "ethers";
import Arena from "./Components/Arena/Arena";
import LoadingIndicator from "./Components/LoadingIndicator";

// Constants
const TWITTER_HANDLE = "cloak777";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const OPENSEA_LINK = `https://testnets.opensea.io/collection/pikachu-and-the-monsters-of-the-multiverse`;

const RARIBLE_LINK = `https://rinkeby.rarible.com/collection/0xdabde73e86f972dc26d8f583e407a47e2eb663e5/items`;

const Nav = () => {
  return (
    <div className="links">
      <div className="os">
        <img src={opensealogo} alt="opensea" />
        <a href={OPENSEA_LINK} target="_blank" rel="noreferrer">
          View Collection On Opensea{" "}
        </a>
      </div>
      <div className="rrb">
        <img src={rariblelogo} alt="rarible" />
        <a href={RARIBLE_LINK} target="_blank" rel="noreferrer">
          View Collection On Rarible{" "}
        </a>
      </div>
    </div>
  );
};

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null); //state to store users wallet
  const [pokemonNFT, setPokemonNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const checkIfWalletConnected = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log("You have metamask, all good!", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          setCurrentAccount(account);
          setConnected(true);
        }
      } else {
        console.log("No authorised account here! ");
        setIsLoading(false); //setting loading state to false as we return after this check is complte
        setConnected(false);
        return;
      }
    } catch (error) {
      console.log("Yikes! We have an error", error);
    }
    setIsLoading(false); //updating loading state to false
  };

  // UseEffects
  useEffect(() => {
    setIsLoading(true);
    checkIfWalletConnected();
  }, []);
  useEffect(() => {
    const fetchNFTMetadata = async () => {
      //fetching a user's NFT meta data by getting their address and using the checkIfUserHasNFT from the pokemonGameContract
      console.log("Checking for Character NFT on address:", currentAccount);

      const provider = new ethers.providers.Web3Provider(window.ethereum); //using provider to signal eth nodes and exchange info of our deployed contract
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        pokemonNFTGame.abi,
        signer
      ); //setting the contract with the address, nft abi and signer

      const txn = await gameContract.checkIfUserHasNFT();
      if (txn.name) {
        console.log("User has pokemon NFT");
        setPokemonNFT(transformPokemonData(txn));
        setIsLoading(false);
      } else {
        console.log("No pokemon NFT found");
      }
    };
    if (currentAccount) {
      //if a current account exists call fetchNFTData function
      console.log("CurrentAccount:", currentAccount);
      fetchNFTMetadata();
    }
  }, [currentAccount]);

  const checkEthereumNetwork = async () => {
    const { ethereum } = window;

    try {
      if (ethereum.networkVersion !== "4") {
        console.warn(
          "Please Connect To Rinkeby Network Through Your Metamask Wallet Extension :)"
        );
        console.log(
          "Please Connect To Rinkeby Network Through Your Metamask Wallet Extension :)"
        );
        alert(
          "Please Connect To Rinkeby Network Through Your Metamask Wallet Extension :)"
        );
        setConnected(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    } //showingloading indication
    if (!currentAccount && !connected) {
      return (
        <div className="connect-wallet-container">
          <img
            src="https://media.giphy.com/media/jYpSOnXqy5Spy/giphy-downsized-large.gif"
            alt="Rayquaza vs Deoxys"
          />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet To Play!
          </button>
          <p className="network-warn">Please Connect To The Rinkeby Network</p>
        </div>
      );
    } else if (currentAccount && !pokemonNFT) {
      return <SelectPokemon setPokemonNFT={setPokemonNFT} />;
    } else if (currentAccount && pokemonNFT) {
      return (
        <Arena pokemonNFT={pokemonNFT} setPokemonNFT={setPokemonNFT}></Arena>
      );
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("All the accounts", accounts);

        const account = accounts[0];

        setCurrentAccount(account);
        console.log("Connected to account", account);
      }
    } catch (error) {
      console.log("error in conencting");
    }
  };

  useEffect(() => {
    checkIfWalletConnected();
  }, []);
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">
            <img
              style={{ width: "1.1em" }}
              src="https://c.tenor.com/Cm7KfjVqri4AAAAi/pokemon-pokeball.gif"
              alt="vs"
            />{" "}
            Pikachu And The Legends Of The Multiverse
            <img
              style={{ width: "1.1em" }}
              src="https://c.tenor.com/Cm7KfjVqri4AAAAi/pokemon-pokeball.gif"
              alt="vs"
            />
          </p>
          <Nav />
          <p className="sub-text">
            Legendary Pokemon unite to save the Multiverse from it's creator,
            Arceus!
          </p>
          {renderContent()}
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
