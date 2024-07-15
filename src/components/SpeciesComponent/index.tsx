import React, { useRef, useState } from 'react';
import { Button, StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { Dropdown, IDropdownRef } from 'react-native-element-dropdown';
import useAllSpecies from '../../hooks/useAllSpecies';

// const data = [
//   { label: 'Human', value: 'Human' },
//   { label: 'Alien', value: 'Alien' },
//   { label: 'Robot', value: 'Robot' },
//   { label: 'Mytholog', value: 'Mytholog' },
//   { label: 'Animal', value: 'Animal' },
//   { label: 'Humanoid', value: 'Humanoid' },
//   { label: 'Poopybutthole', value: 'Poopybutthole' },
//   { label: 'Vampire', value: 'Vampire' },
//   { label: 'Cronenberg', value: 'Cronenberg' },
//   { label: 'Disease', value: 'Disease' },
//   { label: 'Parasite', value: 'Parasite' },
//   { label: 'unknown', value: 'unknown' },
// ];

interface ISpeciesComponentProps {
  availableSpecies: string[];
  species: string;
  setSpecies: (species: string) => void;
  speciesLoading: boolean;
  speciesError: string | null;
}


const SpeciesComponent = ({ availableSpecies, species, setSpecies, speciesLoading, speciesError }: ISpeciesComponentProps) => {
  const ref = useRef<IDropdownRef>(null);

  const data = availableSpecies.map((species) => ({
    label: species,
    value: species,
  }));



  return (
    <>
      {speciesLoading ? (
        <View style={styles.dropdown}>
        <ActivityIndicator size="small" color="#34c759" />
        </View>
      ) : speciesError ? (
        <Text style={styles.errorText}>Error loading species</Text>
      ) : (
        <Dropdown
          ref={ref}
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          iconStyle={styles.iconStyle}
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Select an species"
          value={species}
          closeModalWhenSelectedItem={true}
          onChange={(item) => {
            setSpecies(item.value);
          }}
        />
      )}
    </>
  );
};

export default SpeciesComponent;

const styles = StyleSheet.create({
  dropdown: {
    flex: 1,
    height: 50,
    borderColor: '#34c759',
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    paddingLeft: 16,

  },
  placeholderStyle: {
    fontSize: 16,
    color: '#34c759',

  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#34c759',
  },
  iconStyle: {
    width: 20,
    height: 20,
    tintColor: '#34c759',
    marginRight: 10,
  },
  errorText: {
    color: '#ff3b30',
    textAlign: 'center',
    marginVertical: 10,
  },
});