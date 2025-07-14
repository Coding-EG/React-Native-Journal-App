import { StyleSheet, Text, View, Modal, TouchableOpacity, TextInput, Alert, Image } from 'react-native'
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AES from 'react-native-aes-crypto';
import { encryptJournal } from '../utils/encrypt';

const ViewJournalModal = ({ visible, onSave, onClose, date }) => {


  const [password, setPassword] = useState('');
  const [decrypted, setDecrypted] = useState('');
  const [auth, setAuth] = useState(false);
  const [login,setLogin]=useState(false);

  const generateKey = (password, salt, cost, length) =>
    AES.pbkdf2(password, salt, cost, length, 'sha256');

  const handleDecrypt = async () => {
    try {
      if (date != null || date != '' || password != '') {
        const encrypted = await AsyncStorage.getItem(`${date}`);
        // console.log('view :', encrypted);
        const key = await generateKey(password, 'fe027975e856d13668', 5000, 256);
        const decryptedData = await AES.decrypt(encrypted, key, '69025fe027975e856d136686bf31f7c2', 'aes-256-cbc');
        console.log(decryptedData);
        if (decryptedData == undefined) {
          setDecrypted('');
          Alert.alert('Wrong Password');
          setPassword('');
          return;
        }
        setDecrypted(decryptedData);
        setLogin(true);


      }
    } catch (error) {
      console.error(error);
      setDecrypted('');
      Alert.alert('Wrong Password');
      setPassword('');
    }
  }



  return (
    <Modal visible={visible} animationType='slide'>
      <View style={styles.container}>

        <View style={styles.header}>
          <Text style={styles.headerText}>{date}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={() => {

            onClose();
            setPassword('');
            setDecrypted('');
            setAuth(false);
            setLogin(false);


          }}
          >
            <Text style={[styles.headerText, { color: 'red' }]}>X</Text>
          </TouchableOpacity>
        </View>
        {/* <Text style={styles.journal}>{decrypted || 'encrypted Data Enter Password to Decrypt'}</Text> */}
        <TextInput style={styles.journal} placeholder='Encrypted Data Enter Password to Decrypt' value={decrypted}
          editable={auth}
          multiline
          numberOfLines={50}
          onChangeText={setDecrypted}
        />
        <TouchableOpacity style={[styles.closeButton, auth === true ? { backgroundColor: 'green' } : { backgroundColor: 'red' }, { position: 'absolute', bottom: 175, right: 30 }]} onPress={() => {


          setAuth(!auth);


        }}
          disabled={decrypted !== '' ? false : true}
        >
          <Image
            source={require('../assets/ink-pen.png')} style={{ height: 50, width: 50 }}
          />
        </TouchableOpacity>

        <TextInput style={styles.password} placeholder='Your Password' value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          editable={!login}
        />

        <TouchableOpacity style={styles.encrypt} onPress={()=>{
          if(login){
            encryptJournal(decrypted,password,date);
          }else{
            handleDecrypt();
          }
        }}>
          <Text style={styles.encryptText}>{login ? 'Save Journal' : 'Decrypt Journal'}</Text>
        </TouchableOpacity>




      </View>
    </Modal>
  )
}

export default ViewJournalModal

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
  headerText: {
    fontWeight: 800,
    fontSize: 28,
    // marginLeft:20,
  },
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