import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#34c759" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
        );
    }

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
                keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.episodeContainer}>
                        <Text style={styles.episodeName}>{item.name}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#222222',
    },
    loadingText: {
        color: '#34c759',
        textAlign: 'center',
        marginVertical: 10,
    },
    errorText: {
        color: '#ff3b30',
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
        color: '#34c759',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    detail: {
        color: '#34c759',
        fontSize: 18,
        marginBottom: 10,
    },
    episodeTitle: {
        color: '#34c759',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    episodeContainer: {
        backgroundColor: '#333333',
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
    },
    episodeName: {
        color: '#34c759',
        fontSize: 16,
    },
});

export default DetailsScreen;
