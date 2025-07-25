import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import { Accelerometer } from 'expo-sensors';

const { width } = Dimensions.get('window');
const SQUARE_SIZE = width * 0.8;
const CIRCLE_RADIUS = 20;
const MAX_POS = SQUARE_SIZE / 2 - CIRCLE_RADIUS;

export default function App() {
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    let subscription = Accelerometer.addListener(({ x, y }) => {
      // Inverter eixo y para parecer mais natural (cima/baixo)
      let dx = -x * 40;
      let dy = y * 40;

      position.stopAnimation((currentPos) => {
        let newX = currentPos.x + dx;
        let newY = currentPos.y + dy;

        // Limitar dentro da área visível
        if (newX > MAX_POS) newX = MAX_POS;
        if (newX < -MAX_POS) newX = -MAX_POS;
        if (newY > MAX_POS) newY = MAX_POS;
        if (newY < -MAX_POS) newY = -MAX_POS;

        Animated.spring(position, {
          toValue: { x: newX, y: newY },
          useNativeDriver: false,
          friction: 5,
          tension: 30,
        }).start();
      });
    });

    Accelerometer.setUpdateInterval(100); // em ms

    return () => {
      subscription?.remove();
    };
  }, [position]);

  return (
    <View style={styles.container}>
      <View style={styles.square}>
        <Animated.View
          style={[
            styles.circle,
            {
              transform: position.getTranslateTransform(),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderRadius: CIRCLE_RADIUS,
    backgroundColor: 'tomato',
    position: 'absolute',
  },
});
