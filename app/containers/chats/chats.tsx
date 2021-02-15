import * as React from "react";
import { View, StyleSheet, Text, Image } from "react-native";
import {useSelector} from "react-redux";
// import { I18nContext } from "../../config/i18n";

import {RootState} from "../../redux/root-reducers";


const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 0,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    topContainer: {
        height: 320,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    bottomContainer: {
        flex: 2,
        paddingTop: 40,
        paddingHorizontal: 32,
    },
});

export default function ChatsScreen() {

    const authState = useSelector((state:RootState) => state.auth)

    return (
        <View style={styles.mainContainer}>
            <Text>ChatsScreen+ {authState.firstname}</Text>
        </View>
    );
}
