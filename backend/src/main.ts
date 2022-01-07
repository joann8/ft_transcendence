import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	// cookieParser middleware as global for parsing cookies
	app.use(cookieParser());

	// Enable dto validation globaly
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
		}),
	);

	await app.listen(process.env['BACKEND_PORT']);
}
bootstrap();
