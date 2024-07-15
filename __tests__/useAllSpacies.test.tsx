import { renderHook, act } from '@testing-library/react-hooks';
import { MockedProvider } from '@apollo/client/testing';
import { GET_ALL_CHARACTERS } from '../src/apollo/characters/queries';
import useAllSpecies from '../src/hooks/useAllSpecies';

const mocks = [
    {
        request: {
            query: GET_ALL_CHARACTERS,
            variables: { page: 1 },
        },
        result: {
            data: {
                characters: {
                    info: {
                        next: 2,
                    },
                    results: [
                        { species: 'Human' },
                        { species: 'Alien' },
                    ],
                },
            },
        },
    },
    {
        request: {
            query: GET_ALL_CHARACTERS,
            variables: { page: 2 },
        },
        result: {
            data: {
                characters: {
                    info: {
                        next: null,
                    },
                    results: [
                        { species: 'Robot' },
                    ],
                },
            },
        },
    },
];

test('useAllSpecies fetches all species correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAllSpecies(), {
        wrapper: ({ children}: any) => (
            <MockedProvider mocks={mocks} addTypename={false}>
                {children}
            </MockedProvider>
        ),
    });

    expect(result.current.loading).toBe(true);

    await waitForNextUpdate();

    expect(result.current.loading).toBe(false);
    expect(result.current.species).toEqual(['Human', 'Alien', 'Robot']);
    expect(result.current.error).toBe(null);
});
