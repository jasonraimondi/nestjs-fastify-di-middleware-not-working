import { Get, Injectable, Controller, MiddlewareConsumer, Module, NestModule, NestMiddleware } from "@nestjs/common";

@Injectable()
export class SleepService {
    sleep(ms = 2000) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

@Injectable()
export class SleepMiddleware implements NestMiddleware {
    constructor(private readonly sleepService: SleepService) {}

    async use(_req: any, _res: any, next: () => void) {
        const now = Date.now();
        console.log("start middleware")
        await this.sleepService.sleep();
        console.log(`${Date.now() - now}ms`)
        console.log("done")
        next();
    }
}


@Controller("/")
export class DummyController {
    @Get("/")
    index() {
        console.log("i am the get")
        return "hello world!"
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