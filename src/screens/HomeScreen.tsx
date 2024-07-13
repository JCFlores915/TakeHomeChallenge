import React, { useState } from 'react';
import { FlatList, View, Text, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
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
        <View>
            <TextInput
                placeholder="Search by name"
                value={name}
                onChangeText={(text) => setName(text)}
            />
            {/* Add other filters here */}
            <FlatList
                data={data?.characters?.results || []}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                ListFooterComponent={renderFooter}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })}>
                    <View>
                      <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                      <Text>{item.name}</Text>
                      <Text>{item.species}</Text>
                    </View>
                  </TouchableOpacity>
                )}
            />
        </View>
    );
}

export default HomeScreen;