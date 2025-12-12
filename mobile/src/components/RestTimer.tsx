import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { formatSeconds } from '../utils/time';

export const RestTimer = ({
  duration,
  autoStart = false
}: {
  duration: number;
  autoStart?: boolean;
}) => {
  const [remaining, setRemaining] = useState(duration);
  const [running, setRunning] = useState(autoStart);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (autoStart) start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = () => {
    setRemaining(duration);
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setRemaining((s) => {
        if (s <= 1) {
          stop();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  const stop = () => {
    setRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <Pressable style={[styles.container, running && styles.active]} onPress={running ? stop : start}>
      <Text style={styles.text}>Rest {formatSeconds(remaining)}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center'
  },
  active: { backgroundColor: '#eef' },
  text: { fontWeight: '700' }
});
