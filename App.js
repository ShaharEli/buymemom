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
import ListItem from './components/ListItem';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {MAX_WIDTH, MAX_HEIGHT} from './helpers/Helpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddItemModal from './components/modals/AddItemModal';
import AddMomsNumber from './components/modals/AddMomsNumber';

const filterFunction = (item, itemToCheck) => {
  if (item.item === itemToCheck.item) {
    if (item.amount === itemToCheck.amount) {
      return false;
    }
  }
  return true;
};

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [momsNumber, setMomsNumber] = useState('');
  const [getNumberModalVisible, setNumberModalVisible] = useState(true);
  const [listOfItems, setListOfItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);

  const handleSetListOfItems = async (item, method = 'post') => {
    if (method === 'delete') {
      const filteresList = listOfItems.filter((prevItem) =>
        filterFunction(prevItem, item),
      );
      setListOfItems(filteresList);
      await AsyncStorage.setItem(
        'listOfItems',
        [filteresList]
          .map((item) => JSON.stringify(item))
          .join('#$&splitingSpot&$#'),
      );
    } else {
      setListOfItems((prev) => [item, ...prev]);
      await AsyncStorage.setItem(
        'listOfItems',
        [item, ...listOfItems]
          .map((item) => JSON.stringify(item))
          .join('#$&splitingSpot&$#'),
      );
      setModalVisible(false);
    }
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
        let previousItemsList = await AsyncStorage.getItem('listOfItems');
        if (previousItemsList) {
          previousItemsList = previousItemsList
            .split('#$&splitingSpot&$#')
            .map((item) => JSON.parse(item));
          setListOfItems(...previousItemsList);
        }
      } catch (e) {}
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
          <ButtonContainer onPress={handleEditMomsNumber}>
            <ButtonText>change current number</ButtonText>
          </ButtonContainer>
          <ButtonContainer onPress={() => setModalVisible(true)}>
            <Icon name="add" size={24} />
            <ButtonText color="white">add new item</ButtonText>
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
        <ScrollView style={{marginTop: 50}}>
          {listOfItems.map((item, index) => {
            return (
              <ListItem
                key={index}
                item={item}
                setChosenItems={setChosenItems}
                setListOfItems={setListOfItems}
                handleSetListOfItems={handleSetListOfItems}
              />
            );
          })}
        </ScrollView>
        <Button title="Send to mom" />
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
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : 'rgba(2,25,20,0.9)'};
  text-align: center;
  flex-direction: row;
  margin-top: 30px;
  border-radius: 10px;
  padding: 20px 10px;
  width: 40%;
  align-self: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.color ? props.color : 'white')};
  font-size: 16px;
  /* font-size: inherit;
  font-family: inherit; */
`;
