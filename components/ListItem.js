import React, {useState} from 'react';
import {View, Text} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';

const filterFunction = (item, itemToCheck) => {
  if (item.item === itemToCheck.item) {
    if (item.amount === itemToCheck.amount) {
      return false;
    }
  }
  return true;
};

export default function ListItem({
  item,
  setChosenItems,
  setListOfItems,
  handleSetListOfItems,
}) {
  const [selected, setSelected] = useState(false);
  const handleSelect = () => {
    setSelected(!selected);
    if (selected) {
      setChosenItems((prev) =>
        prev.filter((prevItem) => filterFunction(prevItem, item)),
      );
    } else {
      setChosenItems((prev) => [...prev, item]);
    }
  };
  const handleRemove = () => {
    setListOfItems((prev) =>
      prev.filter((prevItem) => filterFunction(prevItem, item)),
    );
    handleSetListOfItems(item, 'delete');
  };

  return (
    <MainItemListContainer selected={selected}>
      <ListItemContainer selected={selected} onPress={handleSelect}>
        <View>
          <Text>{item.amount}</Text>
        </View>
        <View>
          <Text>{item.item}</Text>
        </View>
        <Text></Text>
      </ListItemContainer>
      <Icon name="trash" size={24} color="red" onPress={handleRemove} />
    </MainItemListContainer>
  );
}

const ListItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-around;
  width: 90%;
`;

const MainItemListContainer = styled.View`
  flex-direction: row;
  width: 90%;
  margin-top: 15px;
  align-items: center;
  background-color: ${(props) => (props.selected ? 'green' : 'blue')};
  padding: 15px;
  border-radius: 50px;
  align-self: center;
  padding-left: 15px;
  background-color: ${(props) => (props.selected ? 'green' : 'blue')};
`;
