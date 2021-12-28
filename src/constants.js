const CONTRACT_ADDRESS = '0xDb71532Bb29c3b47f6fc52dCDE6B828F44386243';
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
