import { MongoDBAdapter as oldMongoDBAdapter } from "@next-auth/mongodb-adapter";
import type { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";
import type { Adapter } from "next-auth/adapters";
import { generateUsername } from "unique-username-generator";

interface MongoDBAdapterOptions {
  /**
   * The name of the {@link https://www.mongodb.com/docs/manual/core/databases-and-collections/#collections MongoDB collections}.
   */
  collections?: {
    Users?: string;
    Accounts?: string;
    Sessions?: string;
    VerificationTokens?: string;
  };
  /**
   * The name you want to give to the MongoDB database
   */
  databaseName?: string;
}

const defaultCollections = {
  Users: "users",
  Accounts: "accounts",
  Sessions: "sessions",
  VerificationTokens: "verification_tokens",
};

function _id(hex: any) {
  if ((hex === null || hex === void 0 ? void 0 : hex.length) !== 24)
    return new ObjectId();
  return new ObjectId(hex);
}

const format = {
  /** Takes a mongoDB object and returns a plain old JavaScript object */
  from(object: any) {
    const newObject: any = {};
    for (const key in object) {
      const value = object[key];
      if (key === "_id") {
        newObject.id = value.toHexString();
      } else if (key === "userId") {
        newObject[key] = value.toHexString();
      } else {
        newObject[key] = value;
      }
    }
    return newObject;
  },
  /** Takes a plain old JavaScript object and turns it into a mongoDB object */
  to(object: any) {
    const newObject: any = {
      _id: _id(object.id),
    };
    for (const key in object) {
      const value = object[key];
      if (key === "userId") newObject[key] = _id(value);
      else if (key === "id") continue;
      else newObject[key] = value;
    }
    return newObject;
  },
};

export default function MongoDBAdapter(
  client: Promise<MongoClient>,
  options: MongoDBAdapterOptions = {}
): Adapter {
  const { collections } = options;
  const { from, to } = format;
  const db = (async () => {
    const _db = (await client).db(options.databaseName);
    const c = { ...defaultCollections, ...collections };
    return {
      U: _db.collection(c.Users),
      A: _db.collection(c.Accounts),
      S: _db.collection(c.Sessions),
      V: _db.collection(c === null || c === void 0 ? "" : c.VerificationTokens),
    };
  })();
  return {
    ...oldMongoDBAdapter(client, options),
    async createUser(data: any) {
      // generate a random username and add it to the data object
      data._id = structuredClone(data.id);
      data.username = generateUsername("", 3, 20);
      data.private = false;
      data.createdAt = new Date();
      data.updatedAt = new Date();
      const user = to(data);
      await (await db).U.insertOne(user);
      return from(user);
    },
  };
}
// Path: src\config\mongoDBAdapter.ts
