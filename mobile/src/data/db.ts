import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('hybrid.db');

export const initDb = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `create table if not exists exercises (
        id text primary key,
        user_id text,
        name text,
        logging_type text,
        parent_exercise_id text,
        progression_level integer,
        group_key text,
        default_rest_seconds integer,
        created_at text,
        updated_at text,
        deleted_at text
      );`
    );
    tx.executeSql(
      `create table if not exists workouts (
        id text primary key,
        user_id text,
        started_at text,
        ended_at text,
        notes text,
        created_at text,
        updated_at text,
        deleted_at text
      );`
    );
    tx.executeSql(
      `create table if not exists workout_exercises (
        id text primary key,
        user_id text,
        workout_id text,
        exercise_id text,
        notes text,
        created_at text,
        updated_at text,
        deleted_at text
      );`
    );
    tx.executeSql(
      `create table if not exists sets (
        id text primary key,
        user_id text,
        workout_exercise_id text,
        exercise_id text,
        logging_type text,
        performance text,
        created_at text,
        updated_at text,
        deleted_at text
      );`
    );
    tx.executeSql(
      `create table if not exists sync_state (
        key text primary key,
        value text
      );`
    );
  });
};

export const getDb = () => db;
