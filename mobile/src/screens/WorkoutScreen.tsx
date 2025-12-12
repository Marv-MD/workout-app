import React, { useEffect, useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import type { Exercise, SetRow, WorkoutExercise } from '../../shared/src/types';
import { listExercises, insertWorkout, insertWorkoutExercise, insertSet, lastPerformanceForExercise } from '../data/repositories';
import { initDb } from '../data/db';
import { seedLocalExercises } from '../data/seed';
import { SetInput } from '../components/SetInput';
import { useWorkoutStore } from '../state/workout';

const WorkoutScreen = () => {
  const [availableExercises, setAvailableExercises] = useState<Exercise[]>([]);
  const [lastSets, setLastSets] = useState<Record<string, SetRow | null>>({});
  const { activeWorkout, startWorkout, exercises, addExercise, addSet } = useWorkoutStore();

  useEffect(() => {
    initDb();
    seedLocalExercises().then(() => listExercises().then(setAvailableExercises));
  }, []);

  const handleStart = async () => {
    const workout = await insertWorkout();
    startWorkout();
    console.log('Workout started', workout.id);
  };

  const handleAddExercise = async (exercise: Exercise) => {
    if (!activeWorkout) return;
    const workoutExercise = await insertWorkoutExercise(activeWorkout, exercise);
    addExercise(exercise);
    const last = await lastPerformanceForExercise(exercise.id);
    setLastSets((prev) => ({ ...prev, [exercise.id]: last }));
    return workoutExercise;
  };

  const handleSaveSet = async (workoutExercise: WorkoutExercise, setRow: SetRow) => {
    const saved = await insertSet({ ...setRow, workout_exercise_id: workoutExercise.id });
    addSet(workoutExercise.id, saved);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Workout</Text>
      {!activeWorkout ? (
        <Button title="Start Workout" onPress={handleStart} />
      ) : (
        <Text>Active workout started at {activeWorkout.started_at}</Text>
      )}

      {activeWorkout && (
        <View style={styles.section}>
          <Text style={styles.subheading}>Add Exercise</Text>
          {availableExercises.map((ex) => (
            <Button key={ex.id} title={ex.name} onPress={() => handleAddExercise(ex)} />
          ))}
        </View>
      )}

      {exercises.map((we) => {
        const exercise = availableExercises.find((e) => e.id === we.exercise_id);
        if (!exercise) return null;
        return (
          <View key={we.id} style={styles.exerciseCard}>
            <SetInput
              exercise={exercise}
              lastSet={lastSets[exercise.id] || null}
              onSave={(setRow) => handleSaveSet(we, setRow)}
            />
          </View>
        );
      })}
    </ScrollView>
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', marginBottom: 12 },
  section: { marginVertical: 12 },
  subheading: { fontSize: 18, marginBottom: 8 },
  exerciseCard: { marginTop: 12 }
});
