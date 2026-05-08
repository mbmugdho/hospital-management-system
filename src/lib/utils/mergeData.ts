// Merges dummy data and real Supabase data into a unified list.
// Dummy rows carry _isDummy: true so the UI can badge and handle them differently.

export type WithMeta<T> = T & {
  _isDummy: boolean
  _localId: string
}

// Attach metadata to dummy rows
export function tagDummy<T extends { id: string }>(items: T[]): WithMeta<T>[] {
  return items.map((item) => ({
    ...item,
    _isDummy: true,
    _localId: `dummy_${item.id}`,
  }))
}

// Attach metadata to real Supabase rows
export function tagReal<T extends { id: string }>(items: T[]): WithMeta<T>[] {
  return items.map((item) => ({
    ...item,
    _isDummy: false,
    _localId: `real_${item.id}`,
  }))
}

// Merge dummy and real into one list
// Real rows come first so they appear at the top
export function mergeData<T extends { id: string }>(
  dummyItems: T[],
  realItems: T[]
): WithMeta<T>[] {
  const tagged = [...tagReal(realItems), ...tagDummy(dummyItems)]
  return tagged
}
