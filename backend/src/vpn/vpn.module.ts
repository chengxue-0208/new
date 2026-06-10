import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpnController } from './vpn.controller';
import { VpnService } from './vpn.service';
import { User, Node, VpnConfiguration, ConnectionLog } from '../entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Node, VpnConfiguration, ConnectionLog]),
  ],
  controllers: [VpnController],
  providers: [VpnService],
  exports: [VpnService],
})
export class VpnModule {}