import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { CurrentUser, AuthUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service'; import { LoginDto, RefreshDto } from './dto/login.dto';
@ApiTags('Auth') @Controller('auth') export class AuthController {
 constructor(private service: AuthService) {}
 @Throttle({ default: { limit: 5, ttl: 60000 } }) @Post('login') login(@Body() dto: LoginDto) { return this.service.login(dto); }
 @Throttle({ default: { limit: 10, ttl: 60000 } }) @Post('refresh') refresh(@Body() dto: RefreshDto) { return this.service.refresh(dto.refreshToken); }
 @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Post('logout') logout(@CurrentUser() user: AuthUser) { return this.service.logout(user.sub); }
 @ApiBearerAuth() @UseGuards(JwtAuthGuard) @Get('me') me(@CurrentUser() user: AuthUser) { return this.service.me(user.sub); }
}
