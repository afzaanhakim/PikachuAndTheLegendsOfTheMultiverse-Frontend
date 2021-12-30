const CONTRACT_ADDRESS = '0xdabde73E86F972DC26D8f583e407a47E2eb663E5';
const transformPokemonData = (pokemonData) => {
  return {
    name: pokemonData.name,
    imageURI: pokemonData.imageUri,
    type: pokemonData.pokemonType,
    hp: pokemonData.hp.toNumber(),
    maxHp: pokemonData.maxHp.toNumber(),
    attackDamage: pokemonData.attackDamage.toNumber(),
  };
};
//formatting data into an object for UI

export  { CONTRACT_ADDRESS, transformPokemonData };
