import React, {useState} from 'react';
import {View, Text, Alert, Modal, TextInput} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';

const modalTitleStyle = {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 40,
  width: '98%',
};

const exitIconStyle = {
  top: 5,
  position: 'absolute',
  color: 'white',
  padding: 10,
  //   right: 10,
};

export default function AddItemModal({
  modalVisible,
  setModalVisible,
  handleSetListOfItems,
}) {
  const [itemAmount, setItemAmount] = useState('');
  const [itemTitle, setItemTitle] = useState('');
  const handleSubmit = () => {
    setItemAmount(itemAmount.replace(/[^0-9]/g, ''));
    const correctNumber = itemAmount.replace(/[^0-9]/g, '');
    if (itemTitle.length > 2) {
      handleSetListOfItems({item: itemTitle, amount: itemAmount});
    } else {
      Alert.alert('Error', 'Please enter valid item');
    }
  };
  return (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
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
                <TextInput
                  placeholder="Enter item name..."
                  value={itemTitle}
                  onChangeText={(e) => setItemTitle(e)}></TextInput>
              </AddItemInput>
              <AddItemInput>
                {/*text.replace(/[^0-9]/g, '')*/}
                <TextInput
                  placeholder="Enter amount..."
                  value={itemAmount}
                  onChangeText={(e) => setItemAmount(e)}></TextInput>
              </AddItemInput>
            </View>
          </ModalContainer>
        </ModalAndExitContainer>
      </>
    </Modal>
  );
}

const AddItemInput = styled.TouchableHighlight`
  border-radius: 50px;
  background-color: #ededed;
  margin: 40px;
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
