import React, { useState, useEffect } from "react";
import "./SelectPokemon.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformPokemonData } from "../../constants";
import PokemonNFTGame from "../../utils/PokemonNFTGame.json";

const SelectPokemon = ({ setPokemonNFT }) => {
  const [pokemon, setPokemon] = useState([]);
  const [pokeContract, setPokeContract] = useState(null);

  const mintPokemonNFTAction = (id) => async () => {
    try {
      if (pokeContract) {
        const mintTxn = await pokeContract.mintPokemonNFT(id);
        await mintTxn.wait();
        console.log(mintTxn, "mINT TXN!");
      }
    } catch (error) {
      console.warn("Error while Minting Pokemon Action", error);
    }
  };
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const pokeContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        PokemonNFTGame.abi,
        signer
      );
      setPokeContract(pokeContract);
    } else {
      console.log("Ethereum Object Not Found");
    }
  }, []);

  useEffect(() => {
    const getPokemon = async () => {
      try {
        console.log("Getting Pokemon to mint");

        const pokemonTxn = await pokeContract.getAllDefaultPokemon();
        setPokemon(pokemonTxn);

        const pokemon = pokemonTxn.map((pokemonData) => {
          return transformPokemonData(pokemonData);
        });

        setPokemon(pokemon);
      } catch (error) {
        console.error("error is hjere", error);
      }
    };
    const onPokemonMint = async (sender, tokenId, pokemonIndex) => {
      console.log("PokemonNFTMinted",
        sender,
        ":sender",
        tokenId.toNumber(),
        ":tokenId",
        "pokemonIndex:",
        pokemonIndex.toNumber(),
        `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
      );
      if (pokeContract) {
        const pokemonNFT = await pokeContract.checkIfUserHasNFT();
        
        setPokemonNFT(transformPokemonData(pokemonNFT));
      }
    };
    console.log("what is pokeContract", pokeContract);
    if (pokeContract) {
      getPokemon();
//SETTING LISTENER FOR NFT MINT

      pokeContract.on('PokemonNFTMinted', onPokemonMint)
    }

    return () => {
      if (pokeContract) {
        //CLEANING UP LISTENER
        pokeContract.off('PokemonNFTMinted', onPokemonMint);
      }
    }
  }, [pokeContract]);

  const renderPokemon = () => {
    const pp = pokemon.map((poke, index) => (
      <div className="character-item" key={poke.name}>
        <div className="name-container">
          <p>{poke.name}</p>
        </div>
        <img src={poke.imageURI} alt={poke.name} />
        <br></br>
        <br></br>
        <button
          type="button"
          className="character-mint-button"
          onClick={mintPokemonNFTAction(index)}
        >{`Mint ${poke.name}`}</button>
      </div>
    ));
    return pp;
    // pokemon.map((poke, index) => (
    //   <div className="character-item" key={poke.name}>
    //     <div className="name-container">
    //       <p>HI</p>
    //       <p>{poke}</p>
    //     </div>
    //     <img src={poke.imageURI} alt={poke.name} />
    //     <button
    //       type="button"
    //       className="character-mint-button"
    //       // onClick={mintCharacterNFTAction(index)}
    //     >{`Mint ${poke.name}`}</button>
    //   </div>
    // ));
  };
  return (
    <div className="select-character-container">
      <h2> Mint Your Multiverse Legendary to save the universe!</h2>
      {pokemon && <div className="character-grid">{renderPokemon()}</div>}
    </div>
  );
};

export default SelectPokemon;
