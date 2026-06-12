"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const seed_1 = require("../src/seed");
async function runSeedScript() {
    const dataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'admin',
        password: 'admin1234',
        database: 'vpn_db',
        entities: ['./src/**/*.entity.ts'],
        synchronize: false,
    });
    try {
        await dataSource.initialize();
        console.log('✅ Database connected');
        await (0, seed_1.runSeed)(dataSource);
        console.log('✅ Database seeding completed successfully!');
    }
    catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
    finally {
        await dataSource.destroy();
    }
}
runSeedScript();
//# sourceMappingURL=seed-runner.js.map