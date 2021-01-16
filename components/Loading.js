import React from 'react';
import {View} from 'react-native';
import {Colors} from 'react-native-paper';
import styled from 'styled-components';
import LottieView from 'lottie-react-native';

export default function Loading() {
  return (
    <Container>
      <LottieView
        source={require('../assets/shopping-cart-check.json')}
        autoPlay
        loop
        style={{
          height: 200,
          width: 200,
        }}
      />
    </Container>
  );
}

const Container = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.grey300};
`;
