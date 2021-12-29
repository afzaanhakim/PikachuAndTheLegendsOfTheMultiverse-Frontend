import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformPokemonData } from "../../constants";
import PokemonNFTGame from "../../utils/PokemonNFTGame.json";
import "./Arena.css";

const Arena = ({ pokemonNFT }) => {
  //passing pokemonNFT to put the card in UI

  const [pokeContract, setPokeContract] = useState(null);

  //useEffect

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const pokeContractData = new ethers.Contract(
        CONTRACT_ADDRESS,
        PokemonNFTGame.abi,
        signer
      );
      setPokeContract(pokeContractData);
      console.log("this is pokecontract data on l26", pokeContract);
    }
  }, []);

  return (
    <div className="arena-container">
      
      <p>GOD NFT </p>

      
      <p>POKEMON NFT GOES HERE</p>
    </div>
  );
};

export default Arena;
