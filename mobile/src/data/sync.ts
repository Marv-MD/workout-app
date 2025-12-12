import { getDb } from './db';
import type { Exercise, SetRow, Workout, WorkoutExercise } from '../../shared/src/types';
import { nowIso } from '../utils/time';

export type SyncQueueItem = {
  id: string;
  table: 'exercises' | 'workouts' | 'workout_exercises' | 'sets';
  payload: Exercise | Workout | WorkoutExercise | SetRow;
  action: 'insert' | 'update' | 'delete';
  created_at: string;
};

const db = getDb();

export const enqueueSync = (item: Omit<SyncQueueItem, 'created_at'>) => {
  db.transaction((tx) => {
    tx.executeSql(
      'create table if not exists sync_queue (id text primary key, table_name text, payload text, action text, created_at text)',
      []
    );
    tx.executeSql('insert or replace into sync_queue (id, table_name, payload, action, created_at) values (?,?,?,?,?)', [
      item.id,
      item.table,
      JSON.stringify(item.payload),
      item.action,
      nowIso()
    ]);
  });
};

export const fetchSyncQueue = (): Promise<SyncQueueItem[]> =>
  new Promise((resolve) => {
    db.readTransaction((tx) => {
      tx.executeSql('select * from sync_queue order by created_at asc', [], (_, { rows }) => {
        resolve(
          rows._array.map((row) => ({
            id: row.id,
            table: row.table_name,
            payload: JSON.parse(row.payload),
            action: row.action,
            created_at: row.created_at
          })) as SyncQueueItem[]
        );
      });
    });
  });

export const clearSyncItem = (id: string) => {
  db.transaction((tx) => {
    tx.executeSql('delete from sync_queue where id=?', [id]);
  });
};

export const SyncEngine = {
  push: async () => {
    // placeholder: integrate Supabase client here
    const queue = await fetchSyncQueue();
    for (const item of queue) {
      console.log('Would sync', item.table, item.action);
      clearSyncItem(item.id);
    }
  },
  pull: async () => {
    console.log('Pull from Supabase not implemented in MVP');
  }
};
