import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogService } from './log.service';
import { SystemLog, ConnectionLog } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([SystemLog, ConnectionLog])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}