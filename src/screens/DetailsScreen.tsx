
import React from 'react';
import { View, Text, Image, FlatList, StyleSheet } from 'react-native';
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
  
    if (loading) return <Text style={styles.loadingText}>Loading...</Text>;
    if (error) return <Text style={styles.errorText}>Error: {error.message}</Text>;
  
  
    const character = data.character;
  
    return (
        <View style={styles.container}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <Text style={styles.name}>{character.name}</Text>
        <Text style={styles.detail}>Species: {character.species}</Text>
        <Text style={styles.detail}>Status: {character.status}</Text>
        <Text style={styles.detail}>Gender: {character.gender}</Text>
        <Text style={styles.detail}>Location: {character.location.name}</Text>
        <Text style={styles.episodeTitle}>Episodes:</Text>
        <FlatList
          data={character.episode}
          keyExtractor={(item) => item?.id?.toString()}
          renderItem={({ item }) => <Text style={styles.episodeName}>{item.name}</Text>}
        />
      </View>
    );
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 20,
    },
    loadingText: {
      color: '#00ff00',
      textAlign: 'center',
      marginVertical: 10,
    },
    errorText: {
      color: '#ff0000',
      textAlign: 'center',
      marginVertical: 10,
    },
    image: {
      width: '100%',
      height: 300,
      borderRadius: 10,
      marginBottom: 20,
    },
    name: {
      color: '#00ff00',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    detail: {
      color: '#00ff00',
      fontSize: 18,
      marginBottom: 10,
    },
    episodeTitle: {
      color: '#00ff00',
      fontSize: 20,
      fontWeight: 'bold',
      marginTop: 20,
      marginBottom: 10,
    },
    episodeName: {
      color: '#00ff00',
      fontSize: 16,
      marginBottom: 5,
    },
  });
export default DetailsScreen;