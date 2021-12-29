import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformPokemonData } from "../../constants";
import PokemonNFTGame from "../../utils/PokemonNFTGame.json";
import "./Arena.css";

const Arena = ({ pokemonNFT }) => {
  //passing pokemonNFT to put the card in UI

  const [pokeContract, setPokeContract] = useState(null);
const [godNFT, setGodNFT] = useState(null)
  //useEffect

  const attackGod = async() => {

  }

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


  useEffect(() => {
   try {
const fetchGod = async () => {
  const godTxn = await pokeContract.getGod()
  console.log(godTxn, "This is GOD POKEMON")

  setGodNFT(godTxn)
}
if (pokeContract){
  fetchGod()
}
   }
   catch(error) {
     console.log("error fetching god pokemon", error)
   }

  }, [pokeContract])

  return (
    <div className="arena-container">
    {/* Replace your Boss UI with this */}
    {godNFT && (
      <div className="boss-container">
        <div className={`boss-content`}>
          <h2>🔥 {godNFT.name} 🔥</h2>
          <div className="image-content">
            <img src={godNFT.imageURI} alt={`Boss ${godNFT.name}`} />
            <div className="health-bar">
              <progress value={godNFT.hp} max={godNFT.maxHp} />
              <p>{`${godNFT.hp} / ${godNFT.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button className="cta-button" onClick={console.log("Attacked God!")}>
            {`💥 Attack ${godNFT.name}`}
          </button>
        </div>
        {pokemonNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{pokemonNFT.name}</h2>
              <img
                src={pokemonNFT.imageURI}
                alt={`Character ${pokemonNFT.name}`}
              />
              <div className="health-bar">
                <progress value={pokemonNFT.hp} max={pokemonNFT.maxHp} />
                <p>{`${pokemonNFT.hp} / ${pokemonNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${pokemonNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
      </div>
    )}
      
      <p>POKEMON NFT GOES HERE</p>
    </div>
  );
};

export default Arena;
