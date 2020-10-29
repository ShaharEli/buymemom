/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {
  ImageBackground,
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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

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
          setListOfItems(previousItemsList);
        }
      } catch (e) {}
    })();
  }, []);

  const handleEditMomsNumber = () => {
    setMomsNumber('');
    setNumberModalVisible(true);
  };

  const sendToMom = () => {
    if (chosenItems.length < 1) {
      Alert.alert('Hey!', 'please choose items first');
    } else {
      const filesToSend = chosenItems
        .map((item) => {
          const amount = Number(item.amount);
          if (amount > 1) {
            return item.amount + ' ' + item.item + 's';
          } else {
            return item.amount + ' ' + item.item;
          }
        })
        .join('\n');
      Linking.openURL(
        'whatsapp://send?text=' +
          'Hi mom can you buy me:\n' +
          filesToSend +
          '&phone=' +
          momsNumber,
      );
    }
  };

  return (
    <>
      <ImageBackground
        source={require('./assets/bg.jpeg')}
        style={{flex: 1, resizeMode: 'cover'}}>
        <MainContainer>
          <TouchableOpacity>
            <MainTitle>Welcome to Buy Me Mom</MainTitle>
          </TouchableOpacity>
          <ButtonContainer onPress={handleEditMomsNumber}>
            <ButtonText>Change Current Number</ButtonText>
          </ButtonContainer>
          <ButtonContainer onPress={() => setModalVisible(true)}>
            <FontAwesomeIcon
              name="plus"
              size={30}
              color="white"
              style={{marginLeft: 2, marginRight: 4}}
            />
            <ButtonText color="white">New Item</ButtonText>
          </ButtonContainer>

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
          <ScrollView style={{marginTop: 30}}>
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
          <Button title="Send to mom" onPress={sendToMom} />
        </MainContainer>
      </ImageBackground>
    </>
  );
};

export default App;

const MainContainer = styled.SafeAreaView`
  /* background-color: #0093e9; */
  flex: 1;
  margin-top: 20px;
  color: whitesmoke;
`;

const MainTitle = styled.Text`
  margin-top: 20px;
  text-align: center;
  font-size: 30px;
  font-weight: bold;
`;

const ButtonContainer = styled.TouchableOpacity`
  justify-content: space-around;
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : 'rgba(2,25,20,0.9)'};
  text-align: center;
  flex-direction: row;
  margin-top: 30px;
  border-radius: 10px;
  padding: 20px 10px;
  width: auto;
  align-self: center;
`;

const ButtonText = styled.Text`
  color: ${(props) => (props.color ? props.color : 'white')};
  font-size: 24px;
  /* font-size: inherit;
  font-family: inherit; */
`;
