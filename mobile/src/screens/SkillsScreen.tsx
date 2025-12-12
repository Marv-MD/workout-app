import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { Exercise, SetRow } from '../../shared/src/types';
import { listExercises, lastPerformanceForExercise } from '../data/repositories';
import { initDb } from '../data/db';
import { seedLocalExercises } from '../data/seed';

const SkillsScreen = () => {
  const [skills, setSkills] = useState<Exercise[]>([]);
  const [last, setLast] = useState<Record<string, SetRow | null>>({});

  useEffect(() => {
    initDb();
    seedLocalExercises().then(() => listExercises()).then((all) => {
      setSkills(all);
      all.forEach((ex) => {
        lastPerformanceForExercise(ex.id).then((res) => setLast((prev) => ({ ...prev, [ex.id]: res })));
      });
    });
  }, []);

  const parents = skills.filter((s) => !s.parent_exercise_id);
  const childrenByParent = skills.reduce<Record<string, Exercise[]>>((acc, ex) => {
    if (ex.parent_exercise_id) {
      acc[ex.parent_exercise_id] = acc[ex.parent_exercise_id] || [];
      acc[ex.parent_exercise_id].push(ex);
    }
    return acc;
  }, {});

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Skill Tree</Text>
      {parents.map((parent) => (
        <View key={parent.id} style={styles.card}>
          <Text style={styles.skill}>{parent.name}</Text>
          {(childrenByParent[parent.id] || []).sort((a, b) => (a.progression_level || 0) - (b.progression_level || 0)).map((child) => (
            <View key={child.id} style={styles.row}>
              <Text style={styles.child}>{child.name}</Text>
              <Text style={styles.meta}>Last: {formatPerf(last[child.id])}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

export default SkillsScreen;

const formatPerf = (set: SetRow | null | undefined) => {
  if (!set) return '—';
  const perf = set.performance as any;
  if ('reps' in perf) return `${perf.reps} reps`;
  if ('seconds' in perf) return `${perf.seconds}s`;
  return '—';
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  card: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 12, marginBottom: 12 },
  skill: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  child: { fontWeight: '600' },
  meta: { color: '#555' }
});
