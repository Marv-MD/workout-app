import { z } from 'zod';

export const loggingTypes = ['REPS_WEIGHT', 'DURATION_WEIGHT', 'BW_REPS'] as const;
export type LoggingType = (typeof loggingTypes)[number];

export const weightUnits = ['kg', 'lb'] as const;
export type WeightUnit = (typeof weightUnits)[number];

export const repsWeightPerformanceSchema = z.object({
  reps: z.number().min(0),
  weight: z.number(),
  unit: z.enum(weightUnits)
});

export const durationWeightPerformanceSchema = z.object({
  seconds: z.number().min(0),
  load: z.number(),
  unit: z.enum(weightUnits)
});

export const bwRepsPerformanceSchema = z.object({
  reps: z.number().min(0),
  load: z.number().default(0),
  unit: z.enum(weightUnits)
});

export const performanceSchemaByType: Record<LoggingType, z.ZodSchema> = {
  REPS_WEIGHT: repsWeightPerformanceSchema,
  DURATION_WEIGHT: durationWeightPerformanceSchema,
  BW_REPS: bwRepsPerformanceSchema
};

export type SetPerformanceByType = {
  REPS_WEIGHT: z.infer<typeof repsWeightPerformanceSchema>;
  DURATION_WEIGHT: z.infer<typeof durationWeightPerformanceSchema>;
  BW_REPS: z.infer<typeof bwRepsPerformanceSchema>;
};

export type BaseRow = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type Exercise = BaseRow & {
  name: string;
  logging_type: LoggingType;
  parent_exercise_id: string | null;
  progression_level: number | null;
  group_key: string | null;
  default_rest_seconds: number | null;
};

export type Workout = BaseRow & {
  started_at: string;
  ended_at: string | null;
  notes: string | null;
};

export type WorkoutExercise = BaseRow & {
  workout_id: string;
  exercise_id: string;
  notes: string | null;
};

export type SetRow<T extends LoggingType = LoggingType> = BaseRow & {
  workout_exercise_id: string;
  exercise_id: string;
  performance: SetPerformanceByType[T];
};

export const setPerformanceSchema = (type: LoggingType) => performanceSchemaByType[type];
