import { ConfigService } from '@nestjs/config';

const DEFAULT_PORT = 3000;

export function getAppPort(configService: ConfigService): number {
  const rawPort = configService.get<string>('PORT');
  const port = Number(rawPort ?? DEFAULT_PORT);

  return Number.isInteger(port) && port > 0 ? port : DEFAULT_PORT;
}

export function isDevelopment(configService: ConfigService): boolean {
  return configService.get<string>('NODE_ENV') === 'development';
}

export function getBooleanConfig(
  configService: ConfigService,
  key: string,
  defaultValue: boolean,
): boolean {
  const value = configService.get<string>(key);

  if (value === undefined) {
    return defaultValue;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}
