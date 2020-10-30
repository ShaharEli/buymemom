import React, {useState} from 'react';
import {View, TouchableOpacity} from 'react-native';
import styled from 'styled-components';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {filterFunction} from '../helpers/Helpers';

export default function ListItem({
  changeAmount,
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
      <AmmountButtonsWrapper>
        <TouchableOpacity onPress={() => changeAmount(item, 'increment')}>
          <FontAwesomeIcon name="plus" color="white" size={18} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeAmount(item, 'decrement')}>
          <FontAwesomeIcon name="minus" color="white" size={18} />
        </TouchableOpacity>
      </AmmountButtonsWrapper>
      <ListItemContainer onPress={handleSelect}>
        <ListItemText>{item.amount}</ListItemText>
        <View style={{width: '90%'}}>
          <ListItemText> {item.item}</ListItemText>
        </View>
      </ListItemContainer>
      <View>
        <Icon
          name="trash"
          size={24}
          color="rgb(245,70,91)"
          onPress={handleRemove}
        />
      </View>
    </MainItemListContainer>
  );
}

const ListItemContainer = styled.TouchableOpacity`
  flex-direction: row;
  width: 70%;
  justify-content: space-between;
`;

const MainItemListContainer = styled.View`
  flex-direction: row;
  height: 65px;
  margin-top: 15px;
  align-items: center;
  background-color: ${(props) =>
    props.selected ? 'green' : 'rgba(28,30,31,0.9)'};
  padding: 5px 15px;
  border-radius: 15px;
  align-self: center;
  padding-left: 15px;
`;

const AmmountButtonsWrapper = styled.View`
  margin-left: 10px;
  margin-right: 20px;
  justify-content: space-around;
  height: 100%;
`;
const ListItemText = styled.Text`
  color: white;
  font-size: 18px;
  font-style: italic;
  text-align: left;
`;
