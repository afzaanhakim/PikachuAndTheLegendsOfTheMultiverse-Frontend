import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformPokemonData } from "../../constants";
import PokemonNFTGame from "../../utils/PokemonNFTGame.json";
import "./Arena.css";

const Arena = ({ pokemonNFT, setPokemonNFT }) => {
  //passing pokemonNFT to put the card in UI

  const [pokeContract, setPokeContract] = useState(null);
  const [godNFT, setGodNFT] = useState(null);
  const [attackState, setAttackState] = useState("");
  //useEffect

  const attackGod = async () => {
    try {
      if (pokeContract) {
        setAttackState("attacking");
        console.log("attacking god!");
        const attackTxn = await pokeContract.attackGod();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");
      }
    } catch (error) {
      console.log("Error while attacking God!");
      setAttackState("");
    }
  };

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
        const godTxn = await pokeContract.getGod();
        console.log(godTxn, "This is GOD POKEMON");

        setGodNFT(godTxn);
      };


        /*
        *  logic when the attack event fires
        */
        const onAttackComplete = (newGodHp, newPlayerHp) => {
          const godHp = newGodHp.toNumber();
          const playerHp = newPlayerHp.toNumber();

          console.log(`AttackComplete: Boss Hp: ${godHp} Player Hp: ${playerHp}`);

          /*
          * Update both player and god Hp
          */
          setGodNFT((prevState) => {
              return { ...prevState, hp: godHp };
          });

          setPokemonNFT((prevState) => {
              return { ...prevState, hp: playerHp };
          });
      };
      if (pokeContract) {
        fetchGod();
        pokeContract.on('AttackComplete', onAttackComplete)
      }

      return () => {
        if(pokeContract){
          pokeContract.off('AttackComplete', onAttackComplete)
        }
      }
    } catch (error) {
      console.log("error fetching god pokemon", error);
    }
  }, [pokeContract]);

  return (
    <div className="arena-container">
      {/* Replace your Boss UI with this */}
      {godNFT && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
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
            <button
              className="cta-button"
              onClick={attackGod}
            >
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
    </div>
  );
};

export default Arena;
