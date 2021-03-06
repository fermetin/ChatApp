import * as React from "react"
import {Pressable, StyleSheet, Text} from "react-native";
import PropTypes from "prop-types"

const PrimaryBtn = (props: any) => {

    const {text, onPress, disabled} = props

    return (
        <Pressable
            style={[styles.primary_btn]}
            onPress={onPress}
            disabled={disabled}
            >
            <Text>
                {text}
            </Text>
        </Pressable>

    )
}

const styles = StyleSheet.create({
    primary_btn: {
        height: 35,
        padding: 5,
        marginVertical:5,
        borderRadius: 8,
        marginHorizontal: 8,
        backgroundColor: "#94b6b9",
        justifyContent: "center",
        alignItems: "center"
    }
})


PrimaryBtn.propTypes = {
    text: PropTypes.string,
    onPress: PropTypes.func,
    disabled: PropTypes.bool
}


export default PrimaryBtn

