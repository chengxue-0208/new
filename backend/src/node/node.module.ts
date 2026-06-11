import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodesController } from './node.controller';
import { NodesService } from './nodes.service';
import { DelayController } from './delay.controller';
import { DelayService } from './delay.service';
import { Node } from './node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodeController, DelayController],
  providers: [NodeService, DelayService],
  exports: [NodeService, DelayService],
})
export class NodeModule {}