export const isString = (str: string | undefined): str is string => !!str // Allows typechecking

// const switchCase = <T, O extends { type: T }, R extends O<T>>(obj: O, funcs: { [type in T]: (arg: O) => R }): R => {
//   const type = obj.type
//   if (funcs[type]) return funcs[type](obj)
// }
//
