import { Tree, NodeID, NodeJoins } from "board/state"

export const isString = (str: string | undefined): str is string => !!str // Allows typechecking

export const reduceObj = <A, O>(obj: O, initial: A, f: (accum: A, value: O[keyof O], key: keyof O, obj: O) => A): A => {
  let init = initial
  for (const key in obj) init = f(init, obj[key], key, obj)
  return init
}

export const filterObj = <O, Keys extends Extract<keyof O, string>[], K extends Keys[number]>(
  obj: O,
  omit: Keys
): Omit<O, K> => {
  const keys = new Set(omit)
  const newObj = { ...obj }
  for (const key in obj) if (keys.has(key)) delete newObj[key]
  return newObj
}

export const mapObj = <A, V, O extends { [key: string]: V }>(obj: O, f: (value: V, key: string, obj: O) => A): A[] => {
  return Object.keys(obj).map((key: string) => f(obj[key], key, obj))
}

