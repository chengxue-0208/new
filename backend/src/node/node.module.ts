import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodesController } from './node.controller';
import { NodesService } from './node.service';
import { DelayController } from './delay.controller';
import { DelayService } from './delay.service';
import { Node } from './node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodesController, DelayController],
  providers: [NodesService, DelayService],
  exports: [NodesService, DelayService],
})
export class NodeModule {}