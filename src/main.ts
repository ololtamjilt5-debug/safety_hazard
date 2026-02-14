import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS тохиргоог нэмэх
  // Бүх домэйнд хандах эрхийг нээх
  app.enableCors({
    origin: '*', // Бүх газраас хүсэлт авахыг зөвшөөрөх  'http://localhost:5173'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
