import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Modal, Alert, NativeModules, Platform } from 'react-native'
import React, { useState } from 'react';
import AES from 'react-native-aes-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddJournalModal = ({ visible, onClose, onSave
}) => {

    const [journal, setJournal] = useState('');
    const [password, setPassword] = useState('');

    const generateKey = (password, salt, cost, length) =>
        AES.pbkdf2(password, salt, cost, length, 'sha256');

    const encrypt = async (text, key) => {
        // this line use to generate randam iv 
        // const iv = await AES.randomKey(16);
        const cipher = await AES.encrypt(text, key, '69025fe027975e856d136686bf31f7c2', 'aes-256-cbc');
        return  cipher;
    };

    

    const handleEncrypt = async () => {
        if (!journal || !password) {
            Alert.alert('Missing, Enter journal and password');
            return;
        }
        try {
            const today = new Date().toISOString().slice(0, 10);
            const key = await generateKey(password, 'fe027975e856d13668', 5000, 256);
            const encrypted = await AES.encrypt(journal, key, '69025fe027975e856d136686bf31f7c2', 'aes-256-cbc');
            console.log(encrypted);
            await AsyncStorage.setItem(`journal-${today}`, encrypted);
            setJournal('');
            setPassword('');
            onSave();
        } catch (error) { console.error(error) }

    }

    return (
        <Modal visible={visible} animationType='slide'>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Daily Journal</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={() => {
                        setJournal('');
                        setPassword('');
                        onClose();


                    }}
                    >
                        <Text style={[styles.headerText, { color: 'red' }]}>X</Text>
                    </TouchableOpacity>
                </View>
                <TextInput style={styles.journal} placeholder='Your Journal Entry' value={journal} editable
                    multiline
                    numberOfLines={50}
                    onChangeText={setJournal} />

                <TextInput style={styles.password} placeholder='Your Password' value={password}
                    onChangeText={setPassword} />

                <TouchableOpacity style={styles.encrypt} onPress={handleEncrypt}>
                    <Text style={styles.encryptText}>Save Encrypted</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default AddJournalModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "center",
        height: 50,
        paddingBottom: 10,
        marginBottom: 10,



    },
    headerText: { fontSize: 28 },
    closeButton: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: '50%',
        justifyContent: 'center',
        alignItems: 'center',

    },
    journal: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    password: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 12,
        marginBottom: 20,
    },
    encrypt: {
        backgroundColor: '#007bff',
        borderRadius: 10,
        paddingVertical: 14,
        alignItems: 'center',
        marginBottom: 12,
    },
    encryptText: {
        color: '#fff',
        fontWeight: 'bold',
    }

})