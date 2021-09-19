import {
  Controller,
  Get,
  Injectable,
  MiddlewareConsumer,
  Module,
  NestMiddleware,
  NestModule,
  Res,
} from "@nestjs/common";
import { FastifyReply } from "fastify";

@Injectable()
export class SleepService {
  sleepMs(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

@Injectable()
export class SleepMiddleware implements NestMiddleware {
  constructor(private readonly sleepService: SleepService) {
  }

  async use(_req: any, _res: any, next: () => void) {
    const now = Date.now();
    console.log("i am now");
    await this.sleepService.sleepMs(1000);
    console.log(`i am ${Date.now() - now}ms`);
    next();
  }
}

@Controller()
class DummyController {
  @Get("/")
  yes(@Res() response: FastifyReply) {
    response.send("This is it yes");
    return;
  }
}

@Module({
  providers: [SleepService, SleepMiddleware],
  controllers: [DummyController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(SleepMiddleware).forRoutes("(.*)");
  }
}