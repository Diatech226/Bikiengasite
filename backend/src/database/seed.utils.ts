/** Insert-only upsert used by the seed so an administrator's later edits always win. */
export async function insertIfMissing<T>(updateOne: (identity: Record<string, unknown>, update: Record<string, unknown>, options: Record<string, unknown>) => Promise<unknown>, identity: Record<string, unknown>, initialValue: T) {
  return updateOne(identity, { $setOnInsert: initialValue }, { upsert: true, runValidators: true });
}
