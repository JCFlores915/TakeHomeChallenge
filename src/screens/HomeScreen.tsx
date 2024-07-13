import React, { useState } from 'react';
import { FlatList, View, Text, Image, ActivityIndicator, Pressable, StyleSheet, Modal, TouchableOpacity, Button, TextInput } from 'react-native';
import { useQuery } from '@apollo/client';
import { GET_CHARACTERS } from '../apollo/characters/queries';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/Navigation';

interface Props extends StackScreenProps<RootStackParamList, 'Home'> { }

const HomeScreen = ({ navigation }: Props) => {
    const [page, setPage] = useState(1);
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_CHARACTERS, {
        variables: { page, name, species, status: selectedStatus },
    });

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Error: {error.message}</Text>
            </View>
        );
    }

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

    const resetFilters = () => {
        setName('');
        setSpecies('');
        setSelectedStatus('');
        setPage(1);
        refetch({ page: 1, name: '', species: '', status: '' });
        setModalVisible(false);
    };

    const applyFilters = () => {
        setPage(1);
        refetch({ page: 1, name, species, status: selectedStatus });
        setModalVisible(false);
    };

    const renderTags = () => (
        <View style={styles.tagsContainer}>
            {name ? <Text style={styles.tag}>Name: {name}</Text> : null}
            {species ? <Text style={styles.tag}>Species: {species}</Text> : null}
            {selectedStatus ? <Text style={styles.tag}>Status: {selectedStatus}</Text> : null}
        </View>
    );

    const renderFooter = () => {
        if (loading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#34c759" />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            );
        }
        return null;
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    placeholder="Search by name"
                    placeholderTextColor="#00ff00"
                    style={styles.input}
                    value={name}
                    onChangeText={(text: string) => setName(text)}
                />
                <TouchableOpacity
                    style={styles.filterButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.filterButtonText}>Filters</Text>
                </TouchableOpacity>
            </View>
            {renderTags()}
            <FlatList
                data={data?.characters?.results || []}
                keyExtractor={(item) => item.id.toString()}
                onEndReached={loadMore}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={() => (
                    !loading && <Text style={styles.emptyText}>No characters found matching "{name}"</Text>
                )}
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

            <Modal
                transparent={true}
                animationType="slide"
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filters</Text>
                        <View style={styles.inputModalContent}>
                            <TextInput
                                placeholder="Species"
                                placeholderTextColor="#00ff00"
                                style={styles.input}
                                value={species}
                                onChangeText={(text: string) => setSpecies(text)}
                            />
                            <View style={styles.radioContainer}>
                                <Text style={styles.radioText}>Status:</Text>
                                <TouchableOpacity
                                    style={styles.radioButton}
                                    onPress={() => setSelectedStatus('alive')}
                                >
                                    <Text style={styles.radioText}>Alive</Text>
                                    {selectedStatus === 'alive' && <View style={styles.radioDot} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.radioButton}
                                    onPress={() => setSelectedStatus('dead')}
                                >
                                    <Text style={styles.radioText}>Dead</Text>
                                    {selectedStatus === 'dead' && <View style={styles.radioDot} />}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.radioButton}
                                    onPress={() => setSelectedStatus('unknown')}
                                >
                                    <Text style={styles.radioText}>Unknown</Text>
                                    {selectedStatus === 'unknown' && <View style={styles.radioDot} />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.modalButtonContainer}>
                            <Button title="Apply" onPress={applyFilters} color="#34c759" />
                            <Button title="Reset" onPress={resetFilters} color="#ff3b30" />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222222',
        padding: 10,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        flex: 1,
        backgroundColor: '#333333',
        color: '#34c759',
        borderRadius: 10,
        padding: 10,
        marginRight: 10,
    },
    filterButton: {
        backgroundColor: '#34c759',
        padding: 10,
        borderRadius: 10,
    },
    filterButtonText: {
        color: '#ffffff',
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
    emptyText: {
        color: '#34c759',
        textAlign: 'center',
        marginVertical: 20,
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#222222',
        padding: 20,
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    inputModalContent: {
        flexDirection: 'column',
        height: 100,
        gap: 10,
    },
    modalTitle: {
        color: '#34c759',
        fontSize: 20,
        marginBottom: 10,
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginVertical: 10,
    },
    tag: {
        borderWidth: 1,
        borderColor: '#34c759',
        backgroundColor: '#333333',
        color: '#34c759',
        padding: 5,
        borderRadius: 10,
        marginRight: 5,
        marginBottom: 5,
    },
    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20,
    
    },
    radioText: {
        color: '#34c759',
        marginLeft: 5,
    },
    radioDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#34c759',
        marginLeft: 5,
    },
});

export default HomeScreen;
