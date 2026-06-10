import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NodeController } from './node.controller';
import { NodeService } from './node.service';
import { DelayController } from './delay.controller';
import { DelayService } from './delay.service';
import { Node } from '../entities/node.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Node])],
  controllers: [NodeController, DelayController],
  providers: [NodeService, DelayService],
  exports: [NodeService, DelayService],
})
export class NodeModule {}