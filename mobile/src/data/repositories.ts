import { getDb } from './db';
import type { Exercise, LoggingType, SetRow, Workout, WorkoutExercise } from '../../shared/src/types';
import { nanoid } from 'nanoid/non-secure';
import { nowIso } from '../utils/time';
import { setPerformanceSchema } from '../../shared/src/types';

const db = getDb();

export const insertExercise = (exercise: Omit<Exercise, 'created_at' | 'updated_at' | 'deleted_at'>) => {
  const created_at = nowIso();
  db.transaction((tx) => {
    tx.executeSql(
      'insert or replace into exercises (id, user_id, name, logging_type, parent_exercise_id, progression_level, group_key, default_rest_seconds, created_at, updated_at, deleted_at) values (?,?,?,?,?,?,?,?,?,?,?)',
      [
        exercise.id,
        exercise.user_id,
        exercise.name,
        exercise.logging_type,
        exercise.parent_exercise_id,
        exercise.progression_level,
        exercise.group_key,
        exercise.default_rest_seconds,
        created_at,
        created_at,
        null
      ]
    );
  });
};

export const listExercises = (): Promise<Exercise[]> =>
  new Promise((resolve, reject) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'select * from exercises where coalesce(deleted_at, "") = "" order by name asc',
        [],
        (_, { rows }) => resolve(rows._array as Exercise[]),
        (_, err) => {
          reject(err);
          return false;
        }
      );
    });
  });

export const insertWorkout = (): Promise<Workout> =>
  new Promise((resolve) => {
    const id = nanoid();
    const ts = nowIso();
    const workout: Workout = {
      id,
      user_id: 'local',
      created_at: ts,
      updated_at: ts,
      deleted_at: null,
      started_at: ts,
      ended_at: null,
      notes: null
    };
    db.transaction((tx) => {
      tx.executeSql(
        'insert into workouts (id, user_id, started_at, ended_at, notes, created_at, updated_at, deleted_at) values (?,?,?,?,?,?,?,?)',
        [id, workout.user_id, workout.started_at, workout.ended_at, workout.notes, ts, ts, null]
      );
    });
    resolve(workout);
  });

export const insertWorkoutExercise = (workout: Workout, exercise: Exercise): Promise<WorkoutExercise> =>
  new Promise((resolve) => {
    const ts = nowIso();
    const workoutExercise: WorkoutExercise = {
      id: nanoid(),
      user_id: workout.user_id,
      workout_id: workout.id,
      exercise_id: exercise.id,
      notes: null,
      created_at: ts,
      updated_at: ts,
      deleted_at: null
    };
    db.transaction((tx) => {
      tx.executeSql(
        'insert into workout_exercises (id, user_id, workout_id, exercise_id, notes, created_at, updated_at, deleted_at) values (?,?,?,?,?,?,?,?)',
        [
          workoutExercise.id,
          workoutExercise.user_id,
          workoutExercise.workout_id,
          workoutExercise.exercise_id,
          workoutExercise.notes,
          ts,
          ts,
          null
        ]
      );
    });
    resolve(workoutExercise);
  });

export const insertSet = (set: Omit<SetRow, 'created_at' | 'updated_at' | 'deleted_at'>): Promise<SetRow> =>
  new Promise((resolve, reject) => {
    const ts = nowIso();
    try {
      setPerformanceSchema(set.logging_type as LoggingType).parse(set.performance);
    } catch (err) {
      reject(err);
      return;
    }
    const row: SetRow = {
      ...set,
      created_at: ts,
      updated_at: ts,
      deleted_at: null
    };
    db.transaction((tx) => {
      tx.executeSql(
        'insert into sets (id, user_id, workout_exercise_id, exercise_id, logging_type, performance, created_at, updated_at, deleted_at) values (?,?,?,?,?,?,?,?,?)',
        [
          row.id,
          row.user_id,
          row.workout_exercise_id,
          row.exercise_id,
          row.logging_type,
          JSON.stringify(row.performance),
          row.created_at,
          row.updated_at,
          row.deleted_at
        ]
      );
    });
    resolve(row);
  });

export const lastPerformanceForExercise = (exerciseId: string): Promise<SetRow | null> =>
  new Promise((resolve) => {
    db.readTransaction((tx) => {
      tx.executeSql(
        'select * from sets where exercise_id=? and deleted_at is null order by created_at desc limit 1',
        [exerciseId],
        (_, { rows }) => {
          if (rows.length === 0) {
            resolve(null);
          } else {
            const row = rows._array[0];
            resolve({ ...row, performance: JSON.parse(row.performance) } as SetRow);
          }
        }
      );
    });
  });
