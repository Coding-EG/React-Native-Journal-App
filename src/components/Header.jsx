import { StyleSheet, Text, View, StatusBar } from 'react-native'
import React from 'react'

const Header = ({heading}) => {
  return (
    <>
    <StatusBar hidden={false}barStyle='dark-content'/>
        
          <View style={styles.heading}>
            <Text style={styles.headingText}>{heading}</Text>
          </View>
    </>
  )
}

export default Header

const styles = StyleSheet.create({
    heading:{
    height:50,
    marginBottom:10,
  },
  headingText:{
    fontWeight:800,
    fontSize:28,
    marginLeft:20,
  },
})