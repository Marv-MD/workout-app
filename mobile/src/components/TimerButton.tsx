import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { formatSeconds } from '../utils/time';

export const TimerButton = ({ onStop }: { onStop?: (seconds: number) => void }) => {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const toggle = () => {
    if (running) {
      setRunning(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
      onStop?.(seconds);
    } else {
      setSeconds(0);
      setRunning(true);
      intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
  };

  return (
    <Pressable style={[styles.button, running && styles.active]} onPress={toggle}>
      <Text style={styles.label}>{running ? 'Stop' : 'Start'} • {formatSeconds(seconds)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
    alignItems: 'center'
  },
  active: { backgroundColor: '#444' },
  label: { color: '#fff', fontWeight: '700' }
});
