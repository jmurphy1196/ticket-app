export default function () {
  if (!process.env.JWT_KEY) throw new Error("JWT_KEY is undefined");
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is undefined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID is undefined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID is undefined");
  if (!process.env.NATS_URL) throw new Error("NATS_URL is undefined");
  if (!process.env.EXPIRATION_WINDOW_SECONDS)
    throw new Error("EXPIRATION_WINDOW_SECONDS is undefined");
}
