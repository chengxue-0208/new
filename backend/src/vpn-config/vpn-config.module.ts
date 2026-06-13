import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VPNConfiguration } from './vpn-config.entity';
import { Node } from '../node/node.entity';
import { VPNConfigurationsController } from './vpn-configurations.controller';
import { VPNConfigurationsService } from './vpn-configurations.service';

@Module({
  imports: [TypeOrmModule.forFeature([VPNConfiguration, Node])],
  controllers: [VPNConfigurationsController],
  providers: [VPNConfigurationsService],
  exports: [VPNConfigurationsService],
})
export class VpnConfigModule {}
