import React, {useState} from 'react';
import {
  View,
  Text,
  Alert,
  Modal,
  TextInput,
  PermissionsAndroid,
} from 'react-native';
import styled from 'styled-components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {selectContactPhone} from 'react-native-select-contact';

const modalTitleStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 40,
  width: '98%',
};

export default function AddMomsNumber({
  getNumberModalVisible,
  momsNumber,
  setMomsNumber,
  setNumberModalVisible,
}) {
  async function getPhoneNumber() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'buymemom App Contacts Permission',
          message:
            'buymemom App needs access to your Contacts ' +
            'so you can send text to them.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      } else {
        console.log('contacts permission denied');
        setPremissionNotGranted(true);
        return;
      }
    } catch (err) {
      console.log(err.message);
      setPremissionNotGranted(true);
      return;
    }

    return selectContactPhone().then((selection) => {
      if (!selection) {
        return null;
      }

      let {contact, selectedPhone} = selection;
      console.log(
        `Selected ${selectedPhone.type} phone number ${selectedPhone.number} from ${contact.name}`,
      );
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
      await AsyncStorage.setItem('momsNumber', typedMomsNumber);
      setNumberModalVisible(false);
      setMomsNumber(typedMomsNumber);
      Alert.alert('Yayy', 'Succesfully added moms number');

      // Linking.openURL(
      //   'whatsapp://send?text=' + 'this.state.msg ' + '&phone=972' + momsNumber,
      // );
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
      await AsyncStorage.setItem('momsNumber', momsNumber);
      setNumberModalVisible(false);
      setMomsNumber(momsNumber);
      Alert.alert('Yayy', 'Succesfully added moms number');

      // Linking.openURL(
      //   'whatsapp://send?text=' + 'this.state.msg ' + '&phone=972' + momsNumber,
      // );
    } catch (e) {
      setMomsNumber('');
      Alert.alert('Error', 'Please enter valid number');
    }
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={getNumberModalVisible}>
      <>
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
      </>
    </Modal>
  );
}

const MomsNumberInput = styled.TouchableHighlight`
  border-radius: 50px;
  background-color: #ededed;
  margin: 10px;
`;

const MainModalContainer = styled.SafeAreaView`
  background-color: #525252;
  flex: 1;
  opacity: 0.7;
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
