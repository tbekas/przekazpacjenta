export function assertDefined<T>(value: T | undefined, error?: string): asserts value is T {
  if (value == undefined) throw new Error(error ? error : "Value was undefined");
}

export function assertDefinedReturn<T>(value: T | undefined): T {
  assertDefined(value);
  return value;
}
