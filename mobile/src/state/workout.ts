import { create } from 'zustand';
import { nanoid } from 'nanoid/non-secure';
import type { Exercise, SetRow, Workout, WorkoutExercise } from '../../shared/src/types';
import { nowIso } from '../utils/time';

export type DraftSet = {
  exercise: Exercise;
  performance: SetRow['performance'];
};

type WorkoutState = {
  activeWorkout: Workout | null;
  exercises: WorkoutExercise[];
  sets: Record<string, SetRow[]>;
  startWorkout: () => void;
  endWorkout: () => void;
  addExercise: (exercise: Exercise) => WorkoutExercise;
  addSet: (workoutExerciseId: string, set: SetRow) => void;
};

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  activeWorkout: null,
  exercises: [],
  sets: {},
  startWorkout: () => {
    const workout: Workout = {
      id: nanoid(),
      user_id: 'local',
      created_at: nowIso(),
      updated_at: nowIso(),
      deleted_at: null,
      started_at: nowIso(),
      ended_at: null,
      notes: null
    };
    set({ activeWorkout: workout, exercises: [], sets: {} });
  },
  endWorkout: () => set({ activeWorkout: null }),
  addExercise: (exercise) => {
    const workout = get().activeWorkout;
    if (!workout) throw new Error('Workout not started');
    const workoutExercise: WorkoutExercise = {
      id: nanoid(),
      user_id: workout.user_id,
      workout_id: workout.id,
      exercise_id: exercise.id,
      notes: null,
      created_at: nowIso(),
      updated_at: nowIso(),
      deleted_at: null
    };
    set((state) => ({ exercises: [...state.exercises, workoutExercise] }));
    return workoutExercise;
  },
  addSet: (workoutExerciseId, setRow) => {
    set((state) => ({
      sets: {
        ...state.sets,
        [workoutExerciseId]: [...(state.sets[workoutExerciseId] || []), setRow]
      }
    }));
  }
}));
