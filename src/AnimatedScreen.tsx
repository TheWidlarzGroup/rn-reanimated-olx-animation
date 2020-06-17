import React, {useState} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import Animated, {
  event,
  Value,
  block,
  stopClock,
  startClock,
  set,
  clockRunning,
  eq,
  cond,
  spring,
  Clock,
  or,
  add,
  lessThan,
  and,
  greaterThan,
  abs,
  neq,
  interpolate,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {theme} from './Theme';
import CircleBg from './components/CircleBg';
import Title from './components/Title';
import CustomText from './components/CustomText';
import Button from './components/Button';
import ArrowDown from './components/ArrowDown';
import {interpolateColor} from 'react-native-redash';

const {height} = Dimensions.get('window');

const expandedTarget = -height * 0.3;
const dragTreshold = -height * 0.3;
const velocityTrigerringTreshold = -2000;

const runSpring = (
  value: Animated.Value<number>,
  dragCompensator: Animated.Value<number>,
  vel: Animated.Adaptable<number>,
  clock: Animated.Clock,
  dragState: Animated.Value<number>,
) => {
  const state = {
    finished: new Value(0),
    velocity: new Value(0),
    position: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue: new Value(0),
    damping: 10,
    mass: 0.4,
    stiffness: 50,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  return block([
    cond(or(eq(dragState, State.BEGAN), eq(dragState, State.ACTIVE)), [
      stopClock(clock),
    ]),
    cond(
      eq(dragState, State.END),
      [
        cond(
          clockRunning(clock),
          [],
          [
            set(state.finished, 0),
            set(state.time, 0),
            set(
              state.position,
              add(
                dragCompensator,
                interpolate(value, {
                  inputRange: [-2, 2],
                  outputRange: [-0.5, 0.5],
                }),
              ),
            ),
            set(state.velocity, vel),
            set(config.toValue, dragCompensator),
            cond(
              or(
                lessThan(vel, velocityTrigerringTreshold),
                and(eq(dragCompensator, 0), lessThan(value, dragTreshold)),
              ),
              [
                set(config.toValue, expandedTarget),
                set(dragCompensator, expandedTarget),
              ],
            ),
            cond(
              or(
                greaterThan(vel, abs(velocityTrigerringTreshold)),
                and(
                  neq(dragCompensator, 0),
                  greaterThan(value, abs(dragTreshold)),
                ),
              ),
              [set(config.toValue, 0), set(dragCompensator, 0)],
            ),
            startClock(clock),
          ],
        ),
        cond(state.finished, stopClock(clock)),
        spring(clock, state, config),
        state.position,
      ],
      [
        add(
          dragCompensator,
          interpolate(value, {
            inputRange: [-2, 2],
            outputRange: [-0.5, 0.5],
          }),
        ),
      ],
    ),
  ]);
};

const AnimatedScreen = () => {
  const [dragY] = useState(new Value(0));
  const [dragCompensator] = useState(new Value(0));
  const [velocity] = useState(new Value(0));
  const [dragState] = useState(new Value(0));
  const [clock] = useState(new Clock());

  const spring = runSpring(dragY, dragCompensator, velocity, clock, dragState);

  const springReversed = interpolate(spring, {
    inputRange: [expandedTarget, 0],
    outputRange: [0, -expandedTarget * 0.5],
  });

  const opacity = interpolate(spring, {
    inputRange: [expandedTarget, 0],
    outputRange: [1, 0],
  });

  const opacityReversed = interpolate(spring, {
    inputRange: [expandedTarget, 0],
    outputRange: [0, 1],
  });

  const scale = interpolate(spring, {
    inputRange: [expandedTarget, 0],
    outputRange: [1, 0],
  });

  const backgroundColor = interpolateColor(spring, {
    inputRange: [expandedTarget, 0],
    outputRange: [theme.colors.white, theme.colors.light],
  });

  const dragHandler = event([
    {
      nativeEvent: {
        translationY: dragY,
        state: dragState,
        velocityY: velocity,
      },
    },
  ]);

  return (
    <Animated.View style={[styles.content, {backgroundColor}]}>
      <CircleBg opacity={opacityReversed} />

      <Animated.Image
        resizeMode="contain"
        style={[styles.xBg, {opacity, transform: [{scale}]}]}
        source={require('../assets/xBg.png')}
      />

      <PanGestureHandler
        onGestureEvent={dragHandler}
        onHandlerStateChange={dragHandler}>
        <Animated.View style={styles.scrollBox}>
          <Animated.View
            style={[
              styles.primaryScreen,
              {transform: [{translateY: spring}], opacity: opacityReversed},
            ]}>
            <Title>{"Hello there!\nIt's me, animation!"}</Title>

            <CustomText>
              {`See it finished in your mind before\nyou ever start. I thought today \nwe would do a happy\nlittle animation!`}
            </CustomText>

            <ArrowDown />
          </Animated.View>

          <Animated.View
            style={[
              styles.secondaryScreen,
              {transform: [{translateY: springReversed}], opacity},
            ]}>
            <Title>I was transitioned</Title>

            <CustomText>
              {`There it is.\nA second paragraph\nin this happy little animation!`}
            </CustomText>

            <Button>Click me now</Button>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
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
