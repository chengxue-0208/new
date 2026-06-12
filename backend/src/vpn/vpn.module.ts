import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VpnController } from './vpn.controller';
import { VpnService } from './vpn.service';
import { User, Node, VPNConfiguration } from '../user/user.entity';
import { ConnectionLog } from '../connection-log/connection-log.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Node, VPNConfiguration, ConnectionLog]),
  ],
  controllers: [VpnController],
  providers: [VpnService],
  exports: [VpnService],
})
export class VpnModule {}