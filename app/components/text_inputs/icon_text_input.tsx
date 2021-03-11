import * as React from "react";
import {TextInput, StyleSheet, View, Text} from "react-native";
import {Ionicons, MaterialIcons} from "@expo/vector-icons"
import PropTypes from "prop-types"
import StyleGuide from "../../style/StyleGuide";
import {useState} from "react";
import HiddenIconTextInput from "./hidden_text_input";


const styles = StyleSheet.create({
    container: {
    },
    textInputContainer:{
        flexDirection: "row",
        borderRadius: 18,
        borderColor: "gray",
        alignItems: "center",
    },
    textInput: {
        padding: 5,
        flex: 1,
        marginBottom:10,
        paddingVertical: 8,
        marginHorizontal: 8,
        borderRadius: 10,
        color: "white",
        backgroundColor: StyleGuide.SecondaryBGColor,
    }
})

const IconTextInput = (props: any): JSX.Element => {

    const {iconName, iconSize, iconColor, secureTextEntry, placeholder, onChangeText, value, error, touched} = props

    console.log(error)

    return (
        <View style={styles.container}>
            <View style={styles.textInputContainer} >
            <Ionicons
                name={iconName}
                size={iconSize}
                color={iconColor}
                style={{paddingLeft: 5}}
            />
            <TextInput
                autoCapitalize={"none"}
                style={styles.textInput}
                secureTextEntry={secureTextEntry}
                placeholder={placeholder}
                clearButtonMode={"while-editing"}
                placeholderTextColor={"white"}
                selectionColor={"white"}
                value={value}
                onChangeText={onChangeText}
            />
            </View>
            <Text></Text>
        </View>
    )
}

IconTextInput.propTypes = {
    iconName: PropTypes.string,
    iconSize: PropTypes.number,
    iconColor: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    placeholder: PropTypes.string,
    placeholderTextColor: PropTypes.string,
    value: PropTypes.string,
    onChangeText: PropTypes.func
}

export default IconTextInput

