import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/common/strategies/jwt.strategy';
import { MailerModule } from 'src/mailer/mailer.module';
import { ViacepModule } from 'src/viacep/viacep.module';

@Module({
  imports:[
    TypeOrmModule.forFeature([AuthEntity]),
    JwtModule.register({
      secret: 'CHAVES',
      signOptions: {
        expiresIn: '1d'
      }
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MailerModule,
    ViacepModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule],
})
export class AuthModule {}
