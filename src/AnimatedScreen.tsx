import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Animated, {
  cond,
  lessThan,
  multiply,
  greaterThan,
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
} from 'react-native-reanimated';
import {
  PanGestureHandler,
  State,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import {theme} from './Theme';
import CircleBg from './components/CircleBg';

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
            set(state.position, value),
            set(state.velocity, vel),
            set(config.toValue, 0),
            debug(`Start clock`, startClock(clock)),
          ],
        ),
        cond(state.finished, debug(`Stop clock`, stopClock(clock))),
        spring(clock, state, config),
        state.position,
      ],
      value,
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
      <Text>hi there</Text>
      <PanGestureHandler
        onGestureEvent={dragHandler}
        // onGestureEvent={(e:PanGestureHandlerGestureEvent) =>{e.nativeEvent.}}
        onHandlerStateChange={dragHandler}>
        <Animated.View
          style={[
            styles.box,
            {transform: [{translateY: spring}]},
          ]}></Animated.View>
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
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'red',
  },
});

export default AnimatedScreen;
