import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../DTOS/dto';
import { Response } from 'src/common/interface/response.interface';
import { GetUser, User } from 'src/common/interface/user.interface';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  async register(@Body() registerDto: RegisterDto): Promise<Response<GetUser>> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión de un usuario' })
  async login(@Body() loginDto: LoginDto): Promise<Response<User | null>> {
    return this.authService.login(loginDto);
  }
}
