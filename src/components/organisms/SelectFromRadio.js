import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import PoppinsTextMedium from '../electrons/customFonts/PoppinsTextMedium';
import { useSelector } from 'react-redux';

const SelectFromRadio = ({ options, name, onSelect, jsonData }) => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const ternaryThemeColor = useSelector(
        (state) => state.apptheme.ternaryThemeColor
    );
    
    const handleSelection = (index) => {

        setSelectedIndex(index);
        if (onSelect) {
            jsonData = {...jsonData, value:options[index]}
            onSelect(jsonData); // return selected value
        }
    };

    const SelectionBox = ({ title, index }) => {
        const selected = selectedIndex === index;

        return (
            <View style={styles.selectionBox}>
                <TouchableOpacity
                    onPress={() => handleSelection(index)}
                    style={[
                        styles.circle,
                        {
                            backgroundColor: selected ? "black" : 'white',
                            borderColor: selected ? "black" : 'black',
                        },
                    ]}
                />
                <PoppinsTextMedium
                    style={styles.text}
                    content={title}
                />
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {/* <PoppinsTextMedium
                style={styles.header}
                content={name?.toUpperCase()}
            /> */}
            <ScrollView contentContainerStyle={styles.scrollView} horizontal={true}>
                {options &&
                    options.map((item, index) => (
                        <SelectionBox key={index} index={index} title={item} />
                    ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    header: {
        color: 'black',
        fontSize: 20,
        fontWeight: '700',
    },
    scrollView: {
        justifyContent: 'space-evenly',
    },
    selectionBox: {
        height: 50,
        width: 120,
        alignItems: 'center',
        justifyContent: 'space-around',
        flexDirection: 'row',
        margin: 10,
        borderWidth: 1,
        borderColor: '#DDDDDD',
        borderRadius: 8,
        padding: 4,
    },
    circle: {
        height: 16,
        width: 16,
        borderRadius: 8,
        borderWidth: 1,
    },
    text: {
        color: 'black',
        fontSize: 17,
        fontWeight: '600',
    },
});

export default SelectFromRadio;
