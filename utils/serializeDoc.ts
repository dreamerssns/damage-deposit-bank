// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeDoc(doc: any): any {
  if (!doc) return doc;
  if (Array.isArray(doc)) return doc.map(serializeDoc);
  if (typeof doc === "object") {
    const obj = { ...doc };
    for (const key in obj) {
      if (
        obj[key]?._bsontype === "ObjectID" ||
        obj[key]?._bsontype === "ObjectId"
      ) {
        obj[key] = obj[key].toString();
      }
      if (obj[key] instanceof Date) {
        obj[key] = obj[key].toISOString();
      }
      // If you expect nested objects/arrays:
      if (typeof obj[key] === "object" && obj[key] !== null) {
        obj[key] = serializeDoc(obj[key]);
      }
    }
    return obj;
  }
  return doc;
}
