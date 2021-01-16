import React, {useState} from 'react';
import {View, Text, Alert, Modal, Button, SafeAreaView} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  TextInput as PTextInput,
  Button as PButton,
  Colors,
} from 'react-native-paper';
import {MAX_HEIGHT, MAX_WIDTH} from '../../helpers/Helpers';

const modalTitleStyle = {
  fontSize: 35,
  padding: 10,
  color: Colors.grey600,
};

const exitIconStyle = {
  top: 5,
  position: 'absolute',
  padding: 10,
  right: 10,
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
    if (itemTitle.length > 1 && correctNumber.length > 0) {
      handleSetListOfItems({item: itemTitle, amount: correctNumber});
      setItemAmount('');
      setItemTitle('');
    } else {
      Alert.alert('Error', 'Please enter valid item');
    }
  };
  return (
    <Modal animationType="fade" transparent={false} visible={modalVisible}>
      <ModalAndExitContainer>
        <Text style={modalTitleStyle}>Add new item</Text>
        <Icon
          name="close"
          size={30}
          style={exitIconStyle}
          color={Colors.grey600}
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
        />
        <ModalContainer>
          <View>
            <AddItemInput>
              <PTextInput
                underlineColor="rgba(40,120,230,1)"
                selectionColor="rgba(40,120,230,1)"
                label="Item name"
                value={itemTitle}
                theme={{colors: {primary: 'rgb(33, 151, 186)'}}}
                onChangeText={(text) => setItemTitle(text)}
              />
            </AddItemInput>
            <AddItemInput>
              <PTextInput
                underlineColor="rgba(40,120,230,1)"
                selectionColor="rgba(40,120,230,1)"
                label="Item amount"
                value={itemAmount}
                theme={{colors: {primary: 'rgb(33, 151, 186)'}}}
                onChangeText={(text) => setItemAmount(text)}
              />
            </AddItemInput>
          </View>
        </ModalContainer>
      </ModalAndExitContainer>
      <MainBtn
        icon="plus"
        mode="contained"
        color="rgba(40,120,230,1)"
        onPress={handleSubmit}>
        Add item
      </MainBtn>
    </Modal>
  );
}

const AddItemInput = styled.View`
  background-color: #ededed;
  margin: 40px;
`;

const MainBtn = styled(PButton)`
  width: 90%;
  align-self: center;
  margin-bottom: 10px;
  margin-top: 10px;
  max-width: 300px;
`;

const ModalAndExitContainer = styled.SafeAreaView`
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

const StyledContainer = styled.SafeAreaView`
  flex: 1;
  background-color: #e8e7f4;
  opacity: 0.4;
`;
