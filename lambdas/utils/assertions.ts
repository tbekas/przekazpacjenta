export function assertDefined<T>(value: T | undefined): asserts value is T {
  if (value == undefined) throw new Error("Value was undefined");
}

export function throwIfUndefined<T>(value: T | undefined): T {
  assertDefined(value);
  return value;
}
