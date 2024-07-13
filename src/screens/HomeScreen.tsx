import React, { useState } from 'react';
import { FlatList, View, Text, Image, TextInput, ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../apollo/characters/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigation';
interface Props extends StackScreenProps<RootStackParamList, 'Home'> { }

const HomeScreen = ({ navigation }: Props) => {
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
          <Pressable
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: pressed ? '#333' : '#111' },
            ]}
            onPress={() => navigation.navigate('Details', { id: item.id })}
          >
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <Text style={styles.characterName}>{item.name}</Text>
              <Text style={styles.characterSpecies}>{item.species}</Text>
            </View>
          </Pressable>
        )}
      />
        </View>
    );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#222222',
      padding: 10,
    },
    input: {
      backgroundColor: '#333333',
      color: '#34c759',
      borderRadius: 10,
      padding: 10,
      marginVertical: 10,
    },
    errorText: {
      color: '#ff3b30',
      textAlign: 'center',
      marginVertical: 10,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    infoContainer: {
      marginLeft: 10,
    },
    characterName: {
      color: '#34c759',
      fontSize: 18,
      fontWeight: 'bold',
    },
    characterSpecies: {
      color: '#34c759',
      fontSize: 14,
    },
  });
  

export default HomeScreen;