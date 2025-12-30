import { QueryClient, useQueries, useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { SinglePokemon } from '../../@types/SinglePokemon'
import { createPortal } from 'react-dom'
import { PokeCard } from './PokeCard'

interface PokemonResult {
  name: string
  url: string
}

interface PokemonApiResponse {
  results: PokemonResult[]
  count: number
  next: string | null
  previous: string | null
}

export const PokeTable = () => {
  const [hasNext, setHasNext] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [poke, setPoke] = useState<SinglePokemon>()

  const fetchPokes = (next: string): Promise<PokemonApiResponse> => {
    console.log({ next })
    return fetch(
      next ? next : 'https://pokeapi.co/api/v2/pokemon?limit=12'
    ).then((res) => res.json())
  }
  const fetchAPoke = (url: string): Promise<SinglePokemon> => {
    return fetch(url).then((res) => res.json())
  }
  const {
    isFetching,
    isPending,
    isError,
    data: pokemon,
    error,
  } = useQuery<PokemonApiResponse, Error>({
    queryKey: ['pokemonList', hasNext],
    queryFn: () => fetchPokes(hasNext),
  })
  const APokemon = useQueries({
    queries: pokemon
      ? pokemon.results.map((thisPoke) => {
        return {
          queryKey: ['pokeMone', thisPoke.url],
          queryFn: () => fetchAPoke(thisPoke.url),
        }
      })
      : [], // if userIds is undefined, an empty array will be returned
  })

  if (APokemon) {
    console.log(APokemon)
  }

  return (
    <div>
      <h1>Pokémon List (Gen 1)</h1>
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {APokemon?.map((poke) => {
            return (
              <div
                className="font-bold shadow-xl shadow-blue-500/50 p-4 bg-gray-400 rounded-lg"
                onClick={() => {
                  setPoke(poke.data)
                  setShowModal(true)
                }}
              >
                <>{poke.data?.id}</>
                <img
                  className=" m-auto"
                  src={poke.data?.sprites.front_default}
                />
                <>{poke.data?.name}</>
              </div>
            )
          })}
        </div>
      )}
      <button
        className="disabled:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          console.log(pokemon)
          setHasNext(pokemon?.previous || '')
        }}
        disabled={pokemon?.previous === null}
      >
        Back
      </button>
      <button
        onClick={() => {
          console.log(pokemon)
          setHasNext(pokemon?.next || '')
        }}
        disabled={!pokemon?.next}
      >
        Next
      </button>
      {isFetching ? <span> Loading...</span> : null}
      {showModal &&
        poke &&
        createPortal(
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg min-w-1/3 min-h-1/8">
              <PokeCard pokemon={poke} onClose={() => setShowModal(false)} />
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
