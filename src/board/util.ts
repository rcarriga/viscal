export const isString = (str: string | undefined): str is string => !!str // Allows typechecking

type StringObj<V> = { [key: string]: V }

export const reduceObj = <A, V, O extends StringObj<V>>(
  obj: O,
  initial: A,
  f: (accum: A, value: V, key: string, obj: O) => A
): A => {
  return Object.keys(obj).reduce((accum, key) => f(accum, obj[key], key, obj), initial)
}

export const filterObj = <V>(obj: StringObj<V>, omit: string[]): StringObj<V> => {
  const keys = new Set(omit)
  const init: StringObj<V> = {}
  return reduceObj(obj, init, (newObj, value: V, key) =>
    keys.has(key)
      ? newObj
      : {
          ...newObj,
          [key]: value
        }
  )
}

export const mapObj = <A, V, O extends { [key: string]: V }>(obj: O, f: (value: V, key: string, obj: O) => A): A[] => {
  return Object.keys(obj).map((key: string) => f(obj[key], key, obj))
}
