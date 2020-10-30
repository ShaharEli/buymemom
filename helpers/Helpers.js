import {Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const MAX_WIDTH = Dimensions.get('window').width;
export const MAX_HEIGHT = Dimensions.get('window').height;
export const filterFunction = (item, itemToCheck) => {
  if (item.item === itemToCheck.item) {
    if (item.amount === itemToCheck.amount) {
      return false;
    }
  }
  return true;
};
export const saveToStorage = async (storage, arr) => {
  await AsyncStorage.setItem(
    storage,
    arr.map((item) => JSON.stringify(item)).join('#$&splitingSpot&$#'),
  );
};
