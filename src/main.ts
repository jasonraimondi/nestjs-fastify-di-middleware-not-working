import "tsconfig-paths/register";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "~/app.module";

void (async function() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule, 
    new FastifyAdapter(),
  );
  await app.listen(8080, "0.0.0.0");
  console.log(`Listening on ${await app.getUrl()}`);
})()
