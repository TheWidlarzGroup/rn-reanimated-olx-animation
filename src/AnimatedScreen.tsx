import React, {useState} from 'react';
import {View, Text, StyleSheet, Image, Dimensions} from 'react-native';
import Animated, {
  cond,
  lessThan,
  multiply,
  greaterThan,
  interpolate,
  sub,
  set,
  spring,
  startClock,
  stopClock,
  block,
  add,
  clockRunning,
  and,
  eq,
  neq,
  or,
  debug,
  call,
  Extrapolate,
} from 'react-native-reanimated';
import {PanGestureHandler, State} from 'react-native-gesture-handler';
import {theme} from './Theme';
import CircleBg from './components/CircleBg';
import Title from './components/Title';
import CustomText from './components/CustomText';
import Button from './components/Button';
import ArrowDown from './components/ArrowDown';

const {height, width} = Dimensions.get('window');

const {Value, event} = Animated;

const runSpring = (
  value: Animated.Adaptable<number>,
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
    stiffness: 80,
    overshootClamping: false,
    restSpeedThreshold: 0.001,
    restDisplacementThreshold: 0.001,
  };

  return block([
    cond(or(eq(dragState, State.BEGAN), eq(dragState, State.ACTIVE)), [
      // every drag disables the clock
      stopClock(clock),
    ]),
    cond(
      eq(dragState, State.END),
      // clock starts whenever drag is finished
      [
        cond(
          clockRunning(clock),
          [],
          [
            set(state.finished, 0),
            set(state.time, 0),
            // set(state.position, value),
            set(
              state.position,
              interpolate(value, {
                inputRange: [-2, 2],
                outputRange: [-0.3, 0.3],
              }),
            ),
            set(state.velocity, vel),
            set(config.toValue, 0),
            debug(`Start clock`, startClock(clock)),
          ],
        ),
        cond(state.finished, debug(`Stop clock`, stopClock(clock))),
        spring(clock, state, config),
        state.position,
      ],
      interpolate(value, {
        inputRange: [-2, 2],
        outputRange: [-0.3, 0.3],
      }),
      // value,
    ),
  ]);
};

const AnimatedScreen = () => {
  const [dragY] = useState(new Value(0));
  const [velocity] = useState(new Value(0));
  const [state] = useState(new Value(0));
  const [clock] = useState(new Animated.Clock());

  const spring = runSpring(dragY, velocity, clock, state);

  const dragHandler = event([
    {
      nativeEvent: {
        translationY: dragY,
        state: state,
        velocityY: velocity,
      },
    },
  ]);

  return (
    <View style={styles.content}>
      <CircleBg />

      <Image
        resizeMode="contain"
        style={styles.xBg}
        source={require('../assets/xBg.png')}
      />

      <PanGestureHandler
        onGestureEvent={dragHandler}
        onHandlerStateChange={dragHandler}>
        <Animated.View style={[styles.scrollBox]}>
          <Animated.View
            style={[styles.primaryScreen, {transform: [{translateY: spring}]}]}>
            <Title>{"Hello there! It's\nnew app!"}</Title>

            <CustomText>
              {`See it finished in your mind before\nyou ever start. There he comes. I thought
        today we would do a happy little animation!`}
            </CustomText>

            <ArrowDown />
          </Animated.View>

          <View style={styles.secondaryScreen}>
            <Title>{'Another screen'}</Title>

            <CustomText>
              There it comes. I thought today we would do a happy little
              animation!
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
