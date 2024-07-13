import React, { useState } from 'react';
import { FlatList, View, Text, Image, TextInput, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../apollo/characters/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigation';
interface Props extends StackScreenProps<RootStackParamList, 'Home'> { }

const HomeScreen = ({navigation}: Props) => {
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [status, setStatus] = useState('');


    const { loading, error, data, fetchMore } = useQuery(GET_CHARACTERS, {
        variables: { page, name, species, status },
    });

    if (error) return <Text>Error :(</Text>;

    const loadMore = () => {
        if (data?.characters.info.next) {
            fetchMore({
                variables: { page: data.characters.info.next },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                    fetchMoreResult.characters.results = [
                        ...prevResult.characters.results,
                        ...fetchMoreResult.characters.results,
                    ];
                    return fetchMoreResult;
                },
            });
        }
    };

    const renderFooter = () => {
        if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
        return null;
    };



    return (
        <View style={styles.container}>
      <TextInput
        placeholder="Search by name"
        placeholderTextColor="#00ff00"
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <FlatList
        data={data?.characters?.results || []}
        keyExtractor={(item) => item.id.toString()}
        onEndReached={loadMore}
        ListFooterComponent={renderFooter}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.characterName}>{item.name}</Text>
            <Text style={styles.characterSpecies}>{item.species}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#000',
      padding: 10,
    },
    input: {
      backgroundColor: '#222',
      color: '#00ff00',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
    },
    errorText: {
      color: '#ff0000',
      textAlign: 'center',
      marginVertical: 10,
    },
    card: {
      backgroundColor: '#111',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
      shadowColor: '#00ff00',
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 10,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 10,
    },
    characterName: {
      color: '#00ff00',
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    characterSpecies: {
      color: '#00ff00',
      fontSize: 14,
      marginTop: 5,
    },
  });
  

export default HomeScreen;