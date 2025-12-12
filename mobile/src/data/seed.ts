import type { Exercise } from '../../shared/src/types';
import { insertExercise, listExercises } from './repositories';

const defaultUser = '00000000-0000-0000-0000-000000000000';

const seedExercises: Exercise[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    user_id: defaultUser,
    name: 'Planche',
    logging_type: 'BW_REPS',
    parent_exercise_id: null,
    progression_level: null,
    group_key: 'planche',
    default_rest_seconds: 120,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    user_id: defaultUser,
    name: 'Planche - Tuck',
    logging_type: 'BW_REPS',
    parent_exercise_id: '00000000-0000-0000-0000-000000000001',
    progression_level: 1,
    group_key: 'planche',
    default_rest_seconds: 90,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    user_id: defaultUser,
    name: 'Planche - Advanced Tuck',
    logging_type: 'BW_REPS',
    parent_exercise_id: '00000000-0000-0000-0000-000000000001',
    progression_level: 2,
    group_key: 'planche',
    default_rest_seconds: 90,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    user_id: defaultUser,
    name: 'Planche - Straddle',
    logging_type: 'BW_REPS',
    parent_exercise_id: '00000000-0000-0000-0000-000000000001',
    progression_level: 3,
    group_key: 'planche',
    default_rest_seconds: 120,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    user_id: defaultUser,
    name: 'Ring Dip',
    logging_type: 'REPS_WEIGHT',
    parent_exercise_id: null,
    progression_level: null,
    group_key: null,
    default_rest_seconds: 180,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000006',
    user_id: defaultUser,
    name: 'Weighted Pull-up',
    logging_type: 'REPS_WEIGHT',
    parent_exercise_id: null,
    progression_level: null,
    group_key: null,
    default_rest_seconds: 180,
    created_at: '',
    updated_at: '',
    deleted_at: null
  },
  {
    id: '00000000-0000-0000-0000-000000000007',
    user_id: defaultUser,
    name: 'Front Lever Hang',
    logging_type: 'DURATION_WEIGHT',
    parent_exercise_id: null,
    progression_level: null,
    group_key: 'frontlever',
    default_rest_seconds: 90,
    created_at: '',
    updated_at: '',
    deleted_at: null
  }
];

export const seedLocalExercises = async () => {
  const existing = await listExercises();
  if (existing.length > 0) return;
  seedExercises.forEach((ex) => insertExercise(ex));
};
