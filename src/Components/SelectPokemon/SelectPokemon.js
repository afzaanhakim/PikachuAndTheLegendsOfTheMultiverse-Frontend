import React, { useState, useEffect } from "react";
import "./SelectPokemon.css";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, transformPokemonData } from "../../constants";
import PokemonNFTGame from "../../utils/PokemonNFTGame.json";

const SelectPokemon = ({ setPokemonNFT }) => {
  const [pokemon, setPokemon] = useState([]);
  const [pokeContract, setPokeContract] = useState(null);

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
      console.log("This is the pokemonNFTGameContract", pokeContract);
      setPokeContract(pokeContract);
      console.log("this is poke contract state line27", pokeContract);
    } else {
      console.log("Ethereum Object Not Found");
    }
  }, []);

  useEffect(() => {
    console.log("useeffect2");
    console.log("pokeContract state on line32 - UE2", pokeContract);
    const getPokemon = async () => {
      try {
        console.log("Getting Pokemon to mint");

        console.log("game contract state in useeffect2", pokeContract);
        const pokemonTxn = await pokeContract.getAllDefaultPokemon();
        console.log("Pokemons", pokemonTxn);
        setPokemon(pokemonTxn);

        const pokemon = pokemonTxn.map((pokemonData) => {
          console.log(
            "this is transformed pokedata",
            transformPokemonData(pokemonData)
          );
          return transformPokemonData(pokemonData);
        });

        setPokemon(pokemon);
        console.log(pokemon, "this is pokemon state on line 41");
      } catch (error) {
        console.error("error is hjere", error);
      }
    };
    console.log("what is pokeContract", pokeContract);
    if (pokeContract) {
      getPokemon();
    }
  }, [pokeContract]);

  const renderPokemon = () => {
    console.log("what is pokemon in render", pokemon)
    
const pp = pokemon.map((poke, index) => <div className="character-item" key={poke.name}>
<div className="name-container">
  <p>{poke.name}</p>
</div>
<img src={poke.imageURI} alt={poke.name} />
<br></br>
<br></br>
<button
  type="button"
  className="character-mint-button"
  // onClick={mintCharacterNFTAction(index)}
>{`Mint ${poke.name}`}</button>
</div>)
    return  pp
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
      <h1>Lol</h1>
      {pokemon && <div className="character-grid">{renderPokemon()}</div>}
    </div>
  );
};

export default SelectPokemon;
