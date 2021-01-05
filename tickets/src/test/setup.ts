import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
declare global {
  namespace NodeJS {
    interface Global {
      signup(id?: string): string[];
      createMongoId(): string;
    }
  }
}

jest.mock("../nats-wrapper.ts");

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "apples";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = (id = "") => {
  //takes an optional id, otherwise will generate a new ID
  let userId;
  if (id === "") {
    userId = mongoose.Types.ObjectId().toHexString();
  } else {
    userId = id;
  }
  // build a jwt payload
  const payload = {
    id: userId,
    password: "testing",
  };
  //create the jwt
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  //build session obj
  const session = { jwt: token };
  //turn into json
  const sessionJSON = JSON.stringify(session);
  // take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");
  //return cookie with encoded data
  return [`express:sess=${base64}`];
};
global.createMongoId = () => {
  return new mongoose.Types.ObjectId().toHexString();
};
