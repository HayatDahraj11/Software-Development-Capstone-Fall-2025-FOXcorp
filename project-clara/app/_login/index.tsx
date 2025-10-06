import { useState } from "react";
import { StyleSheet, TextInput, View, Pressable, Text } from "react-native";

import { Colors } from "@/constants/theme";

export default function Login() {
    const [emailText, onChangeEmailText] = useState<string>('');
    const [passwordText, onChangePasswordText] = useState<string>('');

    const handleLogin = async () => {
        console.log('login pressed! email: ', emailText,' password: ',passwordText)
    }

    return (
        <View style={styles.container}>
            <TextInput 
                style={styles.input}
                onChangeText={onChangeEmailText}
                value={emailText}
                placeholder="Enter Email Address..."
                keyboardType="email-address"
                spellCheck = {false}
            />
            <TextInput 
                style={styles.input}
                onChangeText={onChangePasswordText}
                value={passwordText}
                placeholder="Enter Password..."
                keyboardType="default"
                spellCheck = {false}
                textContentType="password"
            />
            <Pressable style={styles.pressable} onPress={handleLogin}>
                <Text style={styles.pressableLabel}>Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 2,
        padding: 10,
    },
    pressableLabel: {
        color: Colors.light.text,
        textDecorationLine: 'underline',
        fontSize: 16,
    },
    pressable: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
});