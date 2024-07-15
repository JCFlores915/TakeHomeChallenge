import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MockedProvider } from '@apollo/client/testing';
import HomeScreen from '../src/screens/HomeScreen';
import { GET_CHARACTERS } from '../src/apollo/characters/queries';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../src/types';
import { useNavigation } from '@react-navigation/native';

const mocks = [
    {
        request: {
            query: GET_CHARACTERS,
            variables: { page: 1, name: '', species: '', status: '' },
        },
        result: {
            data: {
                characters: {
                    info: {
                        next: 2,
                    },
                    results: [
                        {
                            id: '1',
                            name: 'Rick Sanchez',
                            species: 'Human',
                            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
                        },
                    ],
                },
            },
        },
    },
];

const Stack = createStackNavigator<RootStackParamList>();

const renderWithNavigation = (component: React.ReactElement) => {
    const navigation = {
        navigate: jest.fn(),
        // cualquier otra función que necesites simular
    };

    const route = {
        params: {},
        // cualquier otro parámetro que necesites simular
    };
    return render(
        <NavigationContainer>
            <MockedProvider mocks={mocks} addTypename={false}>
                <Stack.Navigator>
                    <Stack.Screen name="Home" component={HomeScreen} />
                </Stack.Navigator>
            </MockedProvider>
        </NavigationContainer>
    );
};

test('renders HomeScreen correctly', async () => {
    const navigate = jest.fn() as any;
    const route = jest.fn() as any;
    const { getByText, getByPlaceholderText } = renderWithNavigation(<HomeScreen
        navigation={navigate} route={route}
    />);
    await waitFor(() => getByText('Rick Sanchez'));

    expect(getByPlaceholderText('Search by name')).toBeTruthy();
    expect(getByText('Rick Sanchez')).toBeTruthy();
});

test('opens and closes filter modal', async () => {
    const { getByText, getByPlaceholderText } = renderWithNavigation(<HomeScreen
        navigation={useNavigation()} route={jest.fn() as any}
    />);
    await waitFor(() => getByText('Rick Sanchez'));

    fireEvent.press(getByText('Filters'));
    expect(getByText('Filters')).toBeTruthy();

    fireEvent.press(getByText('CLOSE'));
    expect(getByPlaceholderText('Search by name')).toBeTruthy();
});
