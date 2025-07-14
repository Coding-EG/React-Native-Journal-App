import React, { useState, useEffect } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddJournalModal from './src/components/AddJournalModal.jsx';
import ViewJournalModal from './src/components/ViewJournalModal.jsx';
import Header from './src/components/Header.jsx';

function App() {

  const [showAddJournal, setShowAddJournal] = useState(false);
  const [showViewJournal, setShowViewJournal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [keys, setKeys] = useState('');

  const loadJournals = async () => {
    const keys = await AsyncStorage.getAllKeys();
    console.log('keys' + keys);
    setKeys(keys);
  }

  const checkJournal = ()=>{
    const entry = `journal-${new Date().toISOString().slice(0, 10)}`;
    console.log(keys.includes(entry))
    if (keys.includes(entry)){
      return true;
    }
    else return false;
  }

  useEffect(() => {
    loadJournals();
  }, [])

  return (
    <View style={styles.Container}>
      <Header heading='Journal Your Thought' />
      <FlatList
        data={keys}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={() => {
            setSelectedDate(item);
            setShowViewJournal(true);
          }
          }>
            <Text style={{ marginLeft: 10, fontWeight: 600, fontSize: 16 }}>{item}</Text>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.addButton}
        onPress={() => {if (!checkJournal()){setShowAddJournal(true)}}}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <AddJournalModal visible={showAddJournal}
        onClose={() => setShowAddJournal(false)}
        onSave={() => {
          setShowAddJournal(false);
          loadJournals();
        }}
      />

      <ViewJournalModal visible={showViewJournal}
        onClose={() => { setShowViewJournal(false); setSelectedDate(null); }}
        onSave={() => {
          setShowViewJournal(false);
          loadJournals();
        }}
        date={selectedDate} />


    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#fff',
  },
  button: {
    height: 50,
    marginBlock: 10,
    paddingBlock: 10,
    marginInline: 10,
    backgroundColor: '#f8f0ff',
    justifyContent: 'center',
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    bottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 28,
  },

});

export default App;
