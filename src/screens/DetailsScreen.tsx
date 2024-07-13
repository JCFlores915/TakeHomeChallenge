
import React from 'react';
import { View, Text, Image, FlatList } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CHARACTER_BY_ID } from '../apollo/characters/queries';
import { RouteProp } from '@react-navigation/native';


type RootStackParamList = {
  Details: { id: string };
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = ({ route }: { route: DetailsScreenRouteProp }) => {
    const { id } = route.params;
    const { loading, error, data } = useQuery(GET_CHARACTER_BY_ID, {
      variables: { id },
    });
  
    if (loading) return <Text>Loading...</Text>;
    if (error) return <Text>Error: {error.message}</Text>;
  
    const character = data.character;
  
    return (
      <View>
        <Image source={{ uri: character.image }} style={{ width: 200, height: 200 }} />
        <Text>{character.name}</Text>
        <Text>{character.species}</Text>
        <Text>{character.status}</Text>
        <Text>{character.gender}</Text>
        <Text>{character.location.name}</Text>
        <FlatList
          data={character.episode}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => <Text>{item.name}</Text>}
        />
      </View>
    );
  };


export default DetailsScreen;