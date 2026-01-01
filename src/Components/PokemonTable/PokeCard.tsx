import { useQuery } from '@tanstack/react-query'
import type { SinglePokemon } from '../../@types/SinglePokemon'
import type { AbilityType } from '../../@types/AbilityType'

type PokeCardType = {
  pokemon: SinglePokemon
  onClose: () => void
}

export const PokeCard = ({ onClose, pokemon }: PokeCardType) => {
  const AbilityCard = ({name}: {name: string}) => {
    const getAbility = (name: string): Promise<AbilityType> => {
        return fetch(`https://pokeapi.co/api/v2/ability/${name}/`).then(res => res.json())
    }
    const {data: abiltyDesc, isFetching, error} = useQuery({
    queryKey: ['ability', name],
    queryFn: () => getAbility(name)
  })
  if (isFetching) {
    <>Loading...</>
  }
  if (error) {
    <>{error.message}</>
  }
  const uppercaseFirstLetter = name.charAt(0).toUpperCase() + name.slice(1)
  return <div className='pt-2'>
    <p className='pl-1 font-bold underline'>{uppercaseFirstLetter}:</p>
    <small className='pl-2 inline-block'>{abiltyDesc?.effect_entries.find(c => c.language.name === 'en')?.effect}</small>
  </div>
  }
  return (
    <div className=" text-black w-full h-full">
      <div className="flex flex-row justify-between">
        <>
          #{pokemon.id}&nbsp;
          {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </>
        <button onClick={onClose}>close</button>
      </div>
      <div>
        <img className="m-auto" src={pokemon.sprites.other?.['official-artwork'].front_default} />
      </div>
      <h3 className=' leading-1.5 font-bold underline italic'>Abilities:</h3>
      <ul>
        {pokemon.abilities.map((abil) => {
          return <AbilityCard name={abil.ability?.name || ''} />
        })}
      </ul>
    </div>
  )
}
