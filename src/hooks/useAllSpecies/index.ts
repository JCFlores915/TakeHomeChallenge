import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_CHARACTERS } from '../../apollo/characters/queries';

const useAllSpecies = () => {
  const [species, setSpecies] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data, fetchMore } = useQuery(GET_ALL_CHARACTERS, {
    variables: { page: 1 },
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    const fetchAllSpecies = async () => {
      let allSpecies: string[] = [];
      let nextPage = 1;

      try {
        while (nextPage) {
          const { data } = await fetchMore({
            variables: { page: nextPage },
            updateQuery: (prev, { fetchMoreResult }) => fetchMoreResult,
          });

          allSpecies = [
            ...allSpecies,
            ...data.characters.results.map((character: any) => character.species),
          ];
          nextPage = data.characters.info.next;
        }

        setSpecies(Array.from(new Set(allSpecies))); // Remove duplicates
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSpecies();
  }, [fetchMore]);

  return { species, loading, error };
};

export default useAllSpecies;
