import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {theme} from '../Theme';

const arrowWidth = 40;
const arrowHeight = 15;

const ArrowDown = () => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.arrowImage}
        source={require('../../assets/arrowDown.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.unit,
  },
  arrowImage: {
    width: arrowWidth,
    height: arrowHeight,
  },
});

export default ArrowDown;
