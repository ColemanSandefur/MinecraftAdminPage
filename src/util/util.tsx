export type Modify<T, R> = Omit<T, keyof R> & R;

export function safe<T>(func: () => T, def?: T) {
  let val;

  try {
    val = func();
  } catch { }

  return val ?? def;
}
