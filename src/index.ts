import fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest
} from "fastify";
import { IncomingMessage, Server, ServerResponse } from "http";
import { gapi } from "~controllers";

import redis from "@fastify/redis";

import type { JWT } from "google-auth-library";
console.log("[JAY] Starting server...");

const server: FastifyInstance<Server, IncomingMessage, ServerResponse> =
  fastify({ logger: true });
let jwt: JWT;

// MUST remove sample password
server.register(redis, {
  host: "redis",
  port: 6379,
  password: "hello123"
});

server.get("/hello", (request: FastifyRequest<any>, reply) => {
  // console.log("query: ", request.query);
  server.redis.get("author", (error: any, val: any) => {
    reply.send(error || val);
  });
});

server.post("/hello", (request: FastifyRequest<any>, reply) => {
  console.log("body: ", request.body);
  server.redis.set("author", request.body.author, (error: any) => {
    reply.send(error || { status: "ok" });
  });
});

server.get("/ping", async (request, reply) => {
  const response: Chat.Response = {
    version: "2.0",
    template: {
      outputs: [
        {
          simpleText: {
            text: "안녕하세요! 퐁"
          }
        }
      ]
    }
  };

  // reply.send(response);
  return response;
});

server.get("/test", async (request: FastifyRequest<any>, reply) => {
  const { username, password } = request.query;
  const customerHeader = request.headers["h-Custom"];

  console.log("value: ", username, password);
  return "done!";
});

server.get("/calendar", async (request, reply) => {
  const ret = await gapi.getPrimaryCalendar(jwt);
  return ret;
});

server.post("/event", async (request, reply) => {
  const ret = await gapi.createEvent(jwt);
  return ret;
});

server.get("/events", async (request, reply) => {
  try {
    const events = await gapi.listEvents(jwt);
    let ret = {};
    console.log("dev:events: ", events);
    events.map((event, index) => {
      if (event.id) {
        ret[event.id] = event;
        try {
          server.redis.set("dev:events:" + event.id, event);
          console.log("set: ", event);
        } catch (e) {
          console.log("error:", e);
        }
      }
      ret[index] = event;
      server.redis.set("dev:events:" + index, event);
    });
    console.log("FINAL ret: ", ret);
    return ret;
  } catch (e) {
    console.error("Error occurred on GET events/: ", e);
    return [];
  }
});

server.get("/redis", async (request, reply) => {
  try {
    const ret = await server.redis.get("dev:events");
    console.log("ret redis:", ret);
    const ret2 = await server.redis.get("dev:events:0");
    console.log("ret2 redis:", ret2);
    console.log("ret2 redis(JSON):", JSON.stringify(ret2));
    return ret;
  } catch (e) {
    console.error("Error occurred on GET redis/: ", e);
  }
});

server.listen(8080, async (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  jwt = await gapi.getJWT();
  gapi.listEvents(jwt);
  console.log(`Server listening at ${address}`);
});
