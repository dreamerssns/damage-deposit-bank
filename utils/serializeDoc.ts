/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/serializeDoc.ts

/**
 * Safely serializes documents (including Mongoose docs) by converting nested structures
 * and avoiding circular references.
 */

export function serializeDoc(
  doc: any,
  seen: WeakSet<any> = new WeakSet()
): any {
  if (doc === null || typeof doc !== "object") {
    return doc;
  }

  // Avoid circular references
  if (seen.has(doc)) {
    return undefined;
  }
  seen.add(doc);

  // Handle Arrays
  if (Array.isArray(doc)) {
    return doc.map((item) => serializeDoc(item, seen));
  }

  // Handle Buffer-style objects
  if (doc && typeof doc === "object" && "buffer" in doc) {
    // If the buffer is already a string, return it directly:
    if (typeof doc.buffer === "string") return doc.buffer;
    // Otherwise, if it’s a real Node Buffer, use toString():
    return (doc as Buffer).toString();
  }

  // Handle Buffer (e.g., binary fields)
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(doc)) {
    return doc.toString("base64");
  }

  // Handle Date
  if (doc instanceof Date) {
    return doc.toISOString();
  }

  // Handle MongoDB ObjectId
  if (doc._bsontype === "ObjectID" && typeof doc.toString === "function") {
    return doc.toString();
  }

  // Plain object: iterate entries
  const obj: any = {};
  for (const [key, value] of Object.entries(doc)) {
    obj[key] = serializeDoc(value, seen);
  }
  return obj;
}
