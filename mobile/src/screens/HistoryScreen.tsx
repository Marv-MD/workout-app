import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import type { Workout } from '../../shared/src/types';
import { getDb } from '../data/db';
import { seedLocalExercises } from '../data/seed';
import { initDb } from '../data/db';

const HistoryScreen = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    initDb();
    seedLocalExercises();
    const db = getDb();
    db.readTransaction((tx) => {
      tx.executeSql('select * from workouts order by started_at desc', [], (_, { rows }) => {
        setWorkouts(rows._array as Workout[]);
      });
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>History</Text>
      {workouts.map((w) => (
        <View key={w.id} style={styles.card}>
          <Text style={styles.title}>{new Date(w.started_at).toLocaleString()}</Text>
          <Text style={styles.meta}>{w.ended_at ? `Ended: ${w.ended_at}` : 'In progress'}</Text>
          <Text style={styles.meta}>Notes: {w.notes || '—'}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { borderWidth: 1, borderColor: '#eee', borderRadius: 12, padding: 12, marginBottom: 12 },
  title: { fontWeight: '700' },
  meta: { color: '#555', marginTop: 4 }
});
