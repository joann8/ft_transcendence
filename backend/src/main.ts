import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import * as fs from 'fs';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
	/* HTTPS application params
	const httpsOptions = {
		key: fs.readFileSync('./secrets/private-key.pem'),
		cert: fs.readFileSync('./secrets/public-certificate.pem'),
	};
	*/
	// Application creation and configuration
	const app = await NestFactory.create(AppModule, {
		// httpsOptions,
	});
	// Enable CORS
	app.enableCors({
		origin: [process.env.FRONTEND_URL, process.env.FRONTEND_URL_BIS],
		credentials: true,
	});
	// cookieParser middleware as global for parsing cookies
	app.use(cookieParser());

	// Enable dto validation globaly
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			skipMissingProperties: false,
		}),
	);
	await app.listen(process.env.BACKEND_PORT);

	// FIXME: NOT IN PRODUCTION (HOT RELOAD)
	if (module.hot) {
		module.hot.accept();
		module.hot.dispose(() => app.close());
	}
}
bootstrap();
