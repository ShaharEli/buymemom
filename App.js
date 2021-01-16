/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useState, useEffect} from 'react';
import {ImageBackground, ScrollView, Alert, Linking} from 'react-native';
import LottieView from 'lottie-react-native';
import {Button, Appbar} from 'react-native-paper';
import ListItem from './components/ListItem';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AddItemModal from './components/modals/AddItemModal';
import AddMomsNumber from './components/modals/AddMomsNumber';
import {filterFunction, MAX_HEIGHT, saveToStorage} from './helpers/Helpers';
import Loading from './components/Loading';

const App = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [momsNumber, setMomsNumber] = useState('');
  const [getNumberModalVisible, setNumberModalVisible] = useState(true);
  const [listOfItems, setListOfItems] = useState([]);
  const [chosenItems, setChosenItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleSetListOfItems = async (item, method = 'post') => {
    if (method === 'delete') {
      const filteredChosenItems = chosenItems.filter((prevItem) =>
        filterFunction(prevItem, item),
      );
      const filteredList = listOfItems.filter((prevItem) =>
        filterFunction(prevItem, item),
      );
      setChosenItems(filteredChosenItems);
      setListOfItems(filteredList);
      await saveToStorage('listOfItems', filteredList);
    } else {
      setListOfItems((prev) => [item, ...prev]);
      saveToStorage('listOfItems', [item, ...listOfItems]);
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
      await saveToStorage('listOfItems', incrementedList);
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
        await saveToStorage('listOfItems', decrementedList);
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
      } catch (e) {
      } finally {
        (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1300));
          setLoading(false);
        })();
      }
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
        .map((item) => item.amount + ' ' + item.item)
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
  if (loading) return <Loading />;

  return (
    <>
      <StyledAppBar>
        <Appbar.Content title="Buy Me Mom" color="white" />
        <Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
        <Appbar.Action icon="phone" onPress={handleEditMomsNumber} />
      </StyledAppBar>
      <StyledLottieView
        source={require('./assets/soothing-coloured-circle-animation.json')}
        autoPlay
        loop
      />
      <MainContainer>
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
        <StyledBtn
          icon="send"
          mode="contained"
          color="rgba(40,120,230,0.9)"
          onPress={sendToMom}>
          Send to mom
        </StyledBtn>
      </MainContainer>
      {/* </ImageBackground> */}
      {/* </LottieView> */}
    </>
  );
};

export default App;

const StyledBtn = styled(Button)`
  width: 90%;
  align-self: center;
  margin-bottom: 10px;
  margin-top: 10px;
  max-width: 300px;
`;

const MainContainer = styled.SafeAreaView`
  flex: 1;
  margin-top: 50px;
`;

const StyledAppBar = styled(Appbar)`
  position: absolute;
  left: 0px;
  z-index: 100;
  right: 0px;
  top: 0px;
  background-color: rgba(40, 120, 230, 0.9);
`;

const StyledLottieView = styled(LottieView)`
  flex: 1;
  margin-top: 100px;
`;
