import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PropertyModule } from './property/property.module';
import { InspectorApplicantModule } from './inspector-applicant/inspector-applicant.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { diskStorage } from 'multer';
import { RequestModule } from './requests/requests.module';
import { BookingModule } from './booking/booking.module';
import { ServeStaticModule } from '@nestjs/serve-static'; // Import the ServeStaticModule
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { SlotsModule } from './slots/slots.module';
import * as path from 'path';


@Module({
  imports: [
    // ✅ Load environment variables globally
    ConfigModule.forRoot({ isGlobal: true }),

    // ✅ TypeORM Configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'jazakAllah'),
        database: configService.get<string>('DB_NAME', 'pihdb'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // Avoid in production!
      }),
    }),

    // ✅ File Upload Configuration using Multer
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/', // This is where files will be saved
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
    }),

    // ✅ Serve Static Files for images
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        cacheControl: true, // Enable browser caching
        maxAge: 86400 // 1 day cache
      }
    }),

    // ✅ Authentication Module (Ensure JWT is loaded globally)
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'your_jwt_secret'),
        signOptions: { expiresIn: '1h' },
      }),
    }),

    // ✅ Application Modules
    PropertyModule,
    InspectorApplicantModule,
    UsersModule,
    AuthModule,
    RequestModule,
    BookingModule,
    MessageModule,
    ChatModule,
    SlotsModule,
  ],
})
export class AppModule {}
