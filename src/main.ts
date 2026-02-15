import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // Төрлийг импортлох
import { join } from 'path'; // path-ийг импортлох
import { AppModule } from './app.module';

async function bootstrap() {
  // <NestExpressApplication> төрлийг зааж өгснөөр useStaticAssets ажиллах боломжтой болно
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CORS тохиргоо
  app.enableCors({
    origin: true,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  // main.ts
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // 0.0.0.0 гэж зааж өгөх нь Render-д хэрэгтэй
}
bootstrap();
