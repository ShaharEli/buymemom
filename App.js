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

  const changeAmount = async (item, method) => {
    if (method === 'increment') {
      const incrementedList = listOfItems.map((itemToCheck) => {
        if (item.item === itemToCheck.item) {
          if (item.amount === itemToCheck.amount) {
            const changedAmount = Number(item.amount) + 1;
            return {item: item.item, amount: changedAmount};
          }
        }
        return itemToCheck;
      });
      setListOfItems(incrementedList);
      await AsyncStorage.setItem(
        'listOfItems',
        incrementedList
          .map((item) => JSON.stringify(item))
          .join('#$&splitingSpot&$#'),
      );
    } else {
      if (Number(item.amount) < 1) {
        Alert.alert('Waattt', "The item's amount can't be negative");
      } else {
        const decrementedList = listOfItems.map((itemToCheck) => {
          if (item.item === itemToCheck.item) {
            if (item.amount === itemToCheck.amount) {
              const changedAmount = Number(item.amount) - 1;
              return {item: item.item, amount: changedAmount};
            }
          }
          return itemToCheck;
        });
        setListOfItems(decrementedList);
        await AsyncStorage.setItem(
          'listOfItems',
          decrementedList
            .map((item) => JSON.stringify(item))
            .join('#$&splitingSpot&$#'),
        );
      }
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
          setListOfItems(
            Array.isArray(previousItemsList[0]) ? [] : previousItemsList,
          );
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
            // return item.amount + ' ' + item.item + 's';
            return item.amount + ' ' + item.item;
          } else {
            return item.amount + ' ' + item.item;
          }
        })
        .join('\n');
      Linking.openURL(
        'whatsapp://send?text=' +
          'Hey mom, can you please buy me:\n' +
          filesToSend +
          '\nlove u ❤' +
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
            <MainTitle>Buy Me Mom</MainTitle>
          </TouchableOpacity>
          <ButtonContainer
            onPress={handleEditMomsNumber}
            style={{marginTop: 30}}>
            <FontAwesomeIcon
              name="phone"
              color="white"
              size={15}
              style={{marginRight: 10}}
            />

            <ButtonTextChangeNumber>
              Change Current Number
            </ButtonTextChangeNumber>
          </ButtonContainer>
          <ButtonContainer onPress={() => setModalVisible(true)}>
            <FontAwesomeIcon
              name="plus"
              size={30}
              color="white"
              style={{marginRight: 8, marginLeft: 8}}
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
                  changeAmount={changeAmount}
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

const ButtonContainer = styled.TouchableOpacity`
  justify-content: space-around;
  background-color: 'rgba(40,120,230,0.9)';
  text-align: center;
  flex-direction: row;
  margin-top: 10px;
  padding: 10px 10px;
  align-self: flex-end;
  border-bottom-left-radius: 50px;
  border-top-left-radius: 50px;
  background-color: ${(props) =>
    props.bgColor ? props.bgColor : 'rgba(40,120,230,0.9)'};
`;

const MainContainer = styled.SafeAreaView`
  flex: 1;
  margin-top: 20px;
`;

const MainTitle = styled.Text`
  margin-top: 20px;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  color: white;
  background-color: rgba(40, 120, 230, 0.9);
`;

const ButtonTextChangeNumber = styled.Text`
  color: white;

  font-size: 10px;
`;
const ButtonText = styled.Text`
  color: ${(props) => (props.color ? props.color : 'white')};
  font-size: 24px;
`;
