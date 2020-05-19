import React from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import {theme} from '../Theme';

const {height} = Dimensions.get('window');

const bgDimension = height;
const borderWidth = height * 0.25;

const CircleBg = () => {
  return <View style={styles.circleOuter} />;
};

const styles = StyleSheet.create({
  circleOuter: {
    position: 'absolute',
    width: bgDimension,
    height: bgDimension,
    borderRadius: bgDimension,
    borderWidth: borderWidth,
    borderColor: theme.colors.blue,
    backgroundColor: 'transparent',
  },
});

export default CircleBg;
