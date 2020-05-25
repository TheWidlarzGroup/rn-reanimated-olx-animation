import React from 'react';
import {View, StyleSheet, Image, Dimensions} from 'react-native';
import Animated from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {theme} from './Theme';
import CircleBg from './components/CircleBg';
import Title from './components/Title';
import CustomText from './components/CustomText';
import Button from './components/Button';
import ArrowDown from './components/ArrowDown';

const {height} = Dimensions.get('window');

const AnimatedScreen = () => {
  return (
    <View style={styles.content}>
      <CircleBg />

      <Image
        resizeMode="contain"
        style={styles.xBg}
        source={require('../assets/xBg.png')}
      />

      <PanGestureHandler>
        <Animated.View style={styles.scrollBox}>
          <Animated.View style={styles.primaryScreen}>
            <Title>{"Hello there!\nIt's me, animation!"}</Title>

            <CustomText>
              {`See it finished in your mind before\nyou ever start. I thought today \nwe would do a happy\nlittle animation!`}
            </CustomText>

            <ArrowDown />
          </Animated.View>

          <View style={styles.secondaryScreen}>
            <Title>I was transitioned</Title>

            <CustomText>
              {`There it is.\nA second paragraph\nin this happy little animation!`}
            </CustomText>

            <Button>Click me now</Button>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.light,
  },
  scrollBox: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryScreen: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.4,
    transform: [{translateY: height * 0.3}],
  },
  xBg: {
    position: 'absolute',
    height: height,
    width: height,
    transform: [{scale: 0.4}],
    opacity: 0.4,
  },
});

export default AnimatedScreen;
