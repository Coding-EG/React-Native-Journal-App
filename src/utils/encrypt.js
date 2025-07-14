import { Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import AES from 'react-native-aes-crypto';
export function encryptJournal(journal,password,date){
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
            // const today = new Date().toISOString().slice(0, 10);
            const key = await generateKey(password, 'fe027975e856d13668', 5000, 256);
            const encrypted = await AES.encrypt(journal, key, '69025fe027975e856d136686bf31f7c2', 'aes-256-cbc');
            console.log(encrypted);
            await AsyncStorage.setItem(date, encrypted);
            
        } catch (error) { console.error(error) }

    }
    handleEncrypt();
}