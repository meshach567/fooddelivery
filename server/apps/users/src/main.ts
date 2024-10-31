import { NestFactory } from '@nestjs/core';
import { UsersModule } from './users.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(UsersModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'server/email-templates'))
  app.setViewEngine('ejs');
  
  await app.listen(process.env.port ?? 4001);
}
bootstrap();
