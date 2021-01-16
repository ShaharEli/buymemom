import React, {useState} from 'react';
import {Text, Alert, Modal, TextInput, PermissionsAndroid} from 'react-native';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectContactPhone} from 'react-native-select-contact';
import {Button as PButton, Colors} from 'react-native-paper';
import {MAX_HEIGHT, MAX_WIDTH} from '../../helpers/Helpers';

const modalTitleStyle = {
  fontSize: 35,
  padding: 10,
  color: Colors.grey600,
};
export default function AddMomsNumber({
  getNumberModalVisible,
  setMomsNumber,
  setNumberModalVisible,
}) {
  async function getPhoneNumber() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        setPremissionNotGranted(true);
        return;
      }
    } catch (err) {
      setPremissionNotGranted(true);
      return;
    }

    return selectContactPhone().then((selection) => {
      if (!selection) {
        return;
      }

      let {selectedPhone} = selection;
      return selectedPhone.number;
    });
  }
  const [permissionNotGranted, setPremissionNotGranted] = useState(false);
  const [typedMomsNumber, setTypedMomsNumber] = useState('');

  const handleNumberEditEnd = async () => {
    try {
      if (typedMomsNumber.length < 9) {
        throw new Error();
      }
      await AsyncStorage.setItem('momsNumber', '972' + typedMomsNumber);
      setNumberModalVisible(false);
      setMomsNumber('972' + typedMomsNumber);
      Alert.alert('Yayy', 'Succesfully added moms number');
    } catch (e) {
      setMomsNumber('');
      Alert.alert('Error', 'Please enter valid number');
    }
  };

  const handleNumberEdit = async () => {
    try {
      const momsNumber = await getPhoneNumber();
      if (momsNumber.length < 9) {
        throw new Error();
      }
      if (momsNumber.startsWith('05')) {
        await AsyncStorage.setItem('momsNumber', '972' + momsNumber);
        setNumberModalVisible(false);
        setMomsNumber('972' + momsNumber);
        Alert.alert('Yayy', 'Succesfully added moms number');
      } else {
        await AsyncStorage.setItem('momsNumber', momsNumber);
        setNumberModalVisible(false);
        setMomsNumber(momsNumber);
        Alert.alert('Yayy', 'Succesfully added moms number');
      }
    } catch (e) {
      setMomsNumber('');
      Alert.alert('Error', 'Please enter valid number');
    }
  };
  return (
    <Modal
      animationType="fade"
      transparent={false}
      visible={getNumberModalVisible}>
      <MainModalContainer>
        <Text style={modalTitleStyle}>Change mom`s number</Text>
        <ModalContainer>
          {!permissionNotGranted ? (
            <ChangeNumberButton onPress={handleNumberEdit}>
              <Text>Click here to choose contact</Text>
            </ChangeNumberButton>
          ) : (
            <MomsNumberInput>
              <TextInput
                value={typedMomsNumber}
                onChangeText={(e) => setTypedMomsNumber(e)}
                onEndEditing={handleNumberEditEnd}
                placeholder="Enter moms number..."
              />
            </MomsNumberInput>
          )}
        </ModalContainer>
      </MainModalContainer>
    </Modal>
  );
}

const MomsNumberInput = styled.TouchableHighlight`
  border-radius: 50px;
  background-color: #ededed;
  margin: 10px;
`;

const MainModalContainer = styled.SafeAreaView`
  background-color: #e8e7f4;
  height: ${MAX_HEIGHT * 0.8 + 'px'};
  width: ${MAX_WIDTH * 0.9 + 'px'};
  align-self: center;
  margin: auto;
  border-radius: 15px;
`;

const ModalContainer = styled.View`
  flex: 1;
  justify-content: center;
`;

const ChangeNumberButton = styled.TouchableOpacity`
  align-self: center;
  padding: 10px;
  background-color: white;
  border-radius: 50px;
`;
