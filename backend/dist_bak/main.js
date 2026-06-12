"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
const typeorm_1 = require("typeorm");
const seed_1 = require("./seed");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe());
    await app.listen(3000);
    console.log(`Application is running on: http://localhost:3000`);
    if (process.env.NODE_ENV === 'development') {
        const configService = app.get(config_1.ConfigService);
        const dataSource = new typeorm_1.DataSource({
            type: 'postgres',
            url: configService.get('DATABASE_URL'),
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
        });
        if (await dataSource.initialize()) {
            await (0, seed_1.runSeed)(dataSource);
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map