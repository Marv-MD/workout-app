import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { NumericInput } from './NumericInput';
import { TimerButton } from './TimerButton';
import type { Exercise, LoggingType, SetRow } from '../../shared/src/types';
import { setPerformanceSchema } from '../../shared/src/types';
import { RestTimer } from './RestTimer';
import { useSettings } from '../state/settings';
import { nanoid } from 'nanoid/non-secure';

export type SetInputProps = {
  exercise: Exercise;
  lastSet: SetRow | null;
  onSave: (set: SetRow) => void;
};

export const SetInput = ({ exercise, lastSet, onSave }: SetInputProps) => {
  const { restByType } = useSettings();
  const defaultValues = buildDefaults(exercise.logging_type, lastSet);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm({ defaultValues });

  useEffect(() => {
    if (lastSet) {
      Object.entries(lastSet.performance).forEach(([key, val]) => setValue(key as never, String(val)));
    }
  }, [lastSet, setValue]);

  const loggingType = exercise.logging_type as LoggingType;

  const onSubmit = (values: any) => {
    const parsed = setPerformanceSchema(loggingType).safeParse(
      Object.fromEntries(Object.entries(values).map(([k, v]) => [k, Number(v)]))
    );
    if (!parsed.success) {
      console.warn(parsed.error);
      return;
    }
    const set: SetRow = {
      id: nanoid(),
      user_id: 'local',
      workout_exercise_id: 'local',
      exercise_id: exercise.id,
      logging_type: loggingType,
      performance: parsed.data,
      created_at: '',
      updated_at: '',
      deleted_at: null
    };
    onSave(set);
  };

  const renderFields = () => {
    switch (loggingType) {
      case 'REPS_WEIGHT':
        return (
          <>
            <Controller
              name="reps"
              control={control}
              render={({ field: { value, onChange } }) => <NumericInput label="Reps" value={value} onChange={onChange} />}
            />
            <Controller
              name="weight"
              control={control}
              render={({ field: { value, onChange } }) => <NumericInput label="Weight" value={value} onChange={onChange} />}
            />
          </>
        );
      case 'DURATION_WEIGHT':
        return (
          <>
            <Controller
              name="seconds"
              control={control}
              render={({ field: { value, onChange } }) => (
                <NumericInput label="Seconds" value={value} onChange={onChange} />
              )}
            />
            <TimerButton onStop={(s) => setValue('seconds', String(s))} />
            <Controller
              name="load"
              control={control}
              render={({ field: { value, onChange } }) => <NumericInput label="Load" value={value} onChange={onChange} />}
            />
          </>
        );
      case 'BW_REPS':
      default:
        return (
          <>
            <Controller
              name="reps"
              control={control}
              render={({ field: { value, onChange } }) => <NumericInput label="Reps" value={value} onChange={onChange} />}
            />
            <Controller
              name="load"
              control={control}
              render={({ field: { value, onChange } }) => <NumericInput label="Load (+/-)" value={value} onChange={onChange} />}
            />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      {renderFields()}
      {errors && <Text style={styles.error}>Check your values</Text>}
      <Button title="Save Set" onPress={handleSubmit(onSubmit)} />
      <View style={styles.restRow}>
        <RestTimer duration={restByType[loggingType]} autoStart={false} />
      </View>
      <Text style={styles.hint}>Auto-fill uses last logged set when available.</Text>
      <Text style={styles.hint}>Live seconds: {watch('seconds') || '0'}</Text>
    </View>
  );
};

const buildDefaults = (type: LoggingType, lastSet: SetRow | null) => {
  if (lastSet) {
    return Object.fromEntries(
      Object.entries(lastSet.performance).map(([key, val]) => [key, String(val as number)])
    );
  }
  if (type === 'DURATION_WEIGHT') return { seconds: '0', load: '0' };
  if (type === 'REPS_WEIGHT') return { reps: '0', weight: '0' };
  return { reps: '0', load: '0' };
};

const styles = StyleSheet.create({
  container: { borderWidth: 1, borderColor: '#ddd', padding: 12, borderRadius: 12, marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  error: { color: 'red', marginVertical: 4 },
  restRow: { marginTop: 12 },
  hint: { color: '#666', marginTop: 4, fontSize: 12 }
});
