import React from 'react';
import {View, Text, Alert, Modal, TextInput} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
}) {
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
    <Modal
      animationType="slide"
      transparent={true}
      visible={getNumberModalVisible}>
      <>
        <MainModalContainer>
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
