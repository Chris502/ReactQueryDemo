import type { SinglePokemon } from '../../@types/SinglePokemon'

type PokeCardType = {
  pokemon: SinglePokemon
  onClose: () => void
}

export const PokeCard = ({ onClose, pokemon }: PokeCardType) => {
  console.log(pokemon.types)
  return (
    <div className=" text-black w-full h-full">
      <div className="flex flex-row justify-between">
        <>
          #{pokemon.id}
          {pokemon.name}
        </>
        <button onClick={onClose}>close</button>
      </div>
      <div className="m-auto">
        <img src={pokemon.sprites.other?.['official-artwork'].front_default} />
      </div>
      <h3>Abilities:</h3>
      <ul>
        {pokemon.abilities.map((abil) => {
          return <li>{abil.ability?.name}</li>
        })}
      </ul>
    </div>
  )
}
