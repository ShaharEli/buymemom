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

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [momsNumber, setMomsNumber] = useState('');
  const [getNumberModalVisible, setNumberModalVisible] = useState(true);
  const [listOfItems, setListOfItems] = useState([]);

  const handleSetListOfItems = async (item) => {
    setListOfItems((prev) => [item, ...prev]);
    await AsyncStorage.setItem(
      'listOfItems',
      [item, ...prev]
        .map((item) => JSON.stringify(item))
        .join('#$&splitingSpot&$#'),
    );
  };

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
        let previousItemsList = await AsyncStorage.getItem('listOfItem');
        if (previousItemsList) {
          previousItemsList = previousItemsList
            .split('#$&splitingSpot&$#')
            .map((item) => JSON.parse(item));
          setListOfItems(previousItemsList);
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
          handleSetListOfItems={handleSetListOfItems}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
        <AddMomsNumber
          getNumberModalVisible={getNumberModalVisible}
          momsNumber={momsNumber}
          setMomsNumber={setMomsNumber}
          setNumberModalVisible={setNumberModalVisible}
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
