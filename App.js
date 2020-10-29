/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Button,
  Modal,
  TouchableHighlight,
  TextInput,
  Alert,
  Linking,
} from 'react-native';

import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {MAX_WIDTH, MAX_HEIGHT} from './helpers/Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';

const exitIconStyle = {
  top: 5,
  position: 'absolute',
  color: 'white',
  padding: 10,
};

const modalTitleStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 40,
  width: '98%',
};
const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [momsNumber, setMomsNumber] = useState('');
  const [getNumberModalVisible, setNumberModalVisible] = useState(true);
  const [listOfItems, setListOfItems] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const previousMomsNumber = await AsyncStorage.getItem('momsNumber');
        if (previousMomsNumber !== null ) {
         if(previousMomsNumber.length>8){
          setMomsNumber(previousMomsNumber);
          setNumberModalVisible(false);
}
        }
      } catch (e) {
        // error reading value
      }
    })();
  }, []);

  const handleEditMomsNumber = () => {
    setMomsNumber('');
    setNumberModalVisible(true);
  };

  const handleNumberEdit = async () => {
    try {
      if (momsNumber.length < 9) {
        throw new Error();
      }
      Alert.alert('Yayy', 'Succesfully added moms number');
      await AsyncStorage.setItem('momsNumber', momsNumber);
      setNumberModalVisible(false);

      // Linking.openURL(
      //   'whatsapp://send?text=' + 'this.state.msg ' + '&phone=972' + momsNumber,
      // );
    } catch (e) {
      setMomsNumber('');
      Alert.alert('Error', 'Please enter valid number');
    }
  };

  return (
    <>
      <MainContainer>
        <TouchableOpacity>
          <MainTitle>Welcome to Buy Me Mom</MainTitle>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <ButtonContainer numberButton={true} onPress={handleEditMomsNumber}>
            <Text>change current number</Text>
          </ButtonContainer>
          <ButtonContainer onPress={() => setModalVisible(true)}>
            <Icon name="add" size={24} />
            <Text>add new item</Text>
          </ButtonContainer>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <>
            <ModalAndExitContainer>
              <Text style={modalTitleStyle}>Add new item</Text>
              <Icon
                name="close"
                size={30}
                style={exitIconStyle}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              />
              <ModalContainer>
                <View>
                  <AddItemInput>
                    <TextInput placeholder="Enter item name..."></TextInput>
                  </AddItemInput>
                  <AddItemInput>
                    {/*text.replace(/[^0-9]/g, '')*/}
                    <TextInput placeholder="Enter amount..."></TextInput>
                  </AddItemInput>
                </View>
              </ModalContainer>
            </ModalAndExitContainer>
          </>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={getNumberModalVisible}>
          <>
            <ModalAndExitContainer>
              <Text style={modalTitleStyle}>Change mom`s number</Text>
              <ModalContainer>
                <MomsNumberInput>
                  <TextInput
                    placeholder="Enter mom`s number...."
                    onEndEditing={handleNumberEdit}
                    value={momsNumber}
                    onChangeText={(e) => setMomsNumber(e)}
                  />
                </MomsNumberInput>
              </ModalContainer>
            </ModalAndExitContainer>
          </>
        </Modal>
      </MainContainer>
    </>
  );
};

export default App;

const AddItemInput = styled.TouchableHighlight`
  border-radius: 50px;
  background-color: #ededed;
  margin: 40px;
`;

const MomsNumberInput = styled.TouchableHighlight`
  border-radius: 50px;
  background-color: #ededed;
  margin: 10px;
`;

const MainContainer = styled.SafeAreaView`
  background-color: #0093e9;
  flex: 1;
`;

const ModalAndExitContainer = styled.SafeAreaView`
  background-color: #525252;
  flex: 1;
  opacity: 0.7;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const MainTitle = styled.Text`
  margin-top: 20px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
`;

const ButtonContainer = styled.TouchableOpacity`
  justify-content: center;
  text-align: center;
  flex-direction: row;
  margin-top: 30px;
  background-color: green;
  border-radius: 10px;
  padding: 20px 10px;
  width: 40%;
  align-self: center;
  background-color: ${(props) => (props.numberButton ? '#858BF2' : '#F2D64B')};
`;
