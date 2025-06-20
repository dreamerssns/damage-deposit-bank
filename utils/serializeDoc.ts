/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/serializeDoc.ts

/**
 * Recursively serializes a value into JSON-friendly primitives:
 *  - unwraps Mongoose docs (toObject/toJSON)
 *  - converts Buffers, ArrayBuffers, TypedArrays to base64
 *  - serializes Dates, RegExps, ObjectIds
 *  - flattens Sets and Maps
 *  - guards against circular refs
 */
export function serializeDoc(
  input: any,
  seen: WeakSet<object> = new WeakSet()
): any {
  // --- 1. Primitives, null, undefined, functions
  if (input === null || input === undefined || typeof input !== "object") {
    return input;
  }

  // --- 2. Circular references
  if (seen.has(input)) {
    return undefined;
  }
  seen.add(input);

  // --- 3. Mongoose Document
  if (typeof input.toObject === "function") {
    return serializeDoc(input.toObject(), seen);
  }
  if (typeof input.toJSON === "function") {
    return serializeDoc(input.toJSON(), seen);
  }

  // --- 4. Arrays
  if (Array.isArray(input)) {
    return input.map((item) => serializeDoc(item, seen));
  }

  // --- 5. Built-in collections
  if (input instanceof Set) {
    return Array.from(input).map((v) => serializeDoc(v, seen));
  }
  if (input instanceof Map) {
    const obj: Record<string, any> = {};
    for (const [k, v] of input.entries()) {
      obj[String(k)] = serializeDoc(v, seen);
    }
    return obj;
  }

  // --- 6. Buffers & ArrayBuffers
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(input)) {
    return input.toString("base64");
  }
  // TypedArray or DataView
  if (ArrayBuffer.isView(input)) {
    const buf = Buffer.from(
      (input as ArrayBufferView).buffer,
      (input as any).byteOffset,
      (input as any).byteLength
    );
    return buf.toString("base64");
  }
  if (input instanceof ArrayBuffer) {
    const buf = Buffer.from(input);
    return buf.toString("base64");
  }

  // --- 7. BSON‐style wrapper { buffer: … }
  if (input.buffer !== undefined && !(input.buffer instanceof Function)) {
    return serializeDoc(input.buffer, seen);
  }

  // --- 8. Date & RegExp
  if (input instanceof Date) {
    return input.toISOString();
  }
  if (input instanceof RegExp) {
    return input.toString();
  }

  // --- 9. MongoDB ObjectId / Decimal128 / Long etc.
  if (
    typeof input._bsontype === "string" &&
    typeof input.toString === "function"
  ) {
    return input.toString();
  }

  // --- 10. Plain object
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(input)) {
    // skip functions
    if (typeof val === "function") continue;

    try {
      const serialized = serializeDoc(val, seen);
      // if you’d rather drop undefined keys instead of keeping them,
      // use: if (serialized !== undefined) result[key] = serialized;
      result[key] = serialized;
    } catch (err) {
      console.warn(`Failed to serialize key ${key}`, err);
      result[key] = undefined;
    }
  }

  return result;
}
