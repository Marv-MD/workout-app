import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSettings } from '../state/settings';
import type { LoggingType } from '../../shared/src/types';

const loggingLabels: Record<LoggingType, string> = {
  REPS_WEIGHT: 'Reps x Weight',
  DURATION_WEIGHT: 'Duration + Load',
  BW_REPS: 'Bodyweight Reps'
};

const SettingsScreen = () => {
  const { unit, setUnit, restByType, setRest, soundEnabled, vibrationEnabled, toggleSound, toggleVibration } = useSettings();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>
      <View style={styles.section}>
        <Text style={styles.label}>Units</Text>
        <View style={styles.row}>
          <Button title="kg" onPress={() => setUnit('kg')} color={unit === 'kg' ? '#333' : undefined} />
          <Button title="lb" onPress={() => setUnit('lb')} color={unit === 'lb' ? '#333' : undefined} />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Default Rest Times</Text>
        {Object.entries(restByType).map(([type, seconds]) => (
          <View style={styles.row} key={type}>
            <Text style={styles.small}>{loggingLabels[type as LoggingType]}</Text>
            <Button title={`${seconds}s`} onPress={() => setRest(type as LoggingType, seconds + 30)} />
          </View>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Feedback</Text>
        <Button title={`Sound: ${soundEnabled ? 'On' : 'Off'}`} onPress={toggleSound} />
        <Button title={`Vibration: ${vibrationEnabled ? 'On' : 'Off'}`} onPress={toggleVibration} />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { marginBottom: 16 },
  label: { fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  small: { fontSize: 14 }
});
