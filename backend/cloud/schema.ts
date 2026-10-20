import { sql } from 'drizzle-orm';
import { sqliteTable, integer, text, check, index } from 'drizzle-orm/sqlite-core';
export const students = sqliteTable('students', {
  id: integer('id').primaryKey({autoIncrement:true}),
  frogId: text('frog_id').notNull().unique(),
  name: text('name').notNull(),
  avatarId: text('avatar_id').notNull(),
  entryYear: integer('entry_year').notNull().default(0),
  graduationYear: integer('graduation_year').notNull().default(4),
  enrolledAt: text('enrolled_at').notNull(),
  requestId: text('request_id').notNull().unique(),
}, table => [
  check('name_length',sql`length(${table.name}) BETWEEN 1 AND 20`),
  check('canonical_frog_id',sql`${table.frogId} = upper(${table.frogId}) AND length(${table.frogId}) BETWEEN 3 AND 20 AND ${table.frogId} NOT GLOB '*[^A-Z0-9_-]*'`),
  check('avatar_choice',sql`${table.avatarId} IN ('welcome','signal','study','graduate')`),
  check('fixed_entry_year',sql`${table.entryYear} = 0`),
  check('fixed_graduation_year',sql`${table.graduationYear} = 4`),
]);
export const rateLimits = sqliteTable('rate_limits', {
  bucket: text('bucket').primaryKey(),
  hits: integer('hits').notNull().default(1),
  expiresAt: integer('expires_at').notNull(),
}, table=>[index('rate_limits_expiry').on(table.expiresAt)]);
