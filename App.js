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
import AddItemModal from './components/modals/AddItemModal';
import AddMomsNumber from './components/modals/AddMomsNumber';

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
        if (previousMomsNumber !== null) {
          if (previousMomsNumber.length > 8) {
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
        <AddItemModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <AddMomsNumber
          getNumberModalVisible={getNumberModalVisible}
          momsNumber={momsNumber}
          setMomsNumber={setMomsNumber}
        />
      </MainContainer>
    </>
  );
};

export default App;

const MainContainer = styled.SafeAreaView`
  background-color: #0093e9;
  flex: 1;
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
