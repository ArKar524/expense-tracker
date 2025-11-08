import React from 'react';
import { KeyboardAvoidingView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Defs, Pattern, Rect } from 'react-native-svg';

interface ContainerProps {
  children?: React.ReactNode;
}

/**
 * Container with:
 * - High-performance dotted background
 * - SafeAreaView
 * - KeyboardAvoidingView
 */
export default function Container({ children }: ContainerProps) {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.keyboard}
    >
      {/* Dotted background */}
      <Svg style={styles.background} height="100%" width="100%">
        <Defs>
          <Pattern
            id="dots"
            patternUnits="userSpaceOnUse"
            width="15"
            height="15"
          >
            <Circle cx="7.5" cy="7.5" r="1" fill="#3a3a3a" />
          </Pattern>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#dots)" />
      </Svg>

      {/* Main content */}
      <SafeAreaView edges={['bottom', 'left', 'right','top']} style={styles.content}>
        {children}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
