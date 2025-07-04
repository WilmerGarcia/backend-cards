import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsInt } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'El nombre de usuario del nuevo usuario' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'La contraseña del nuevo usuario' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'El correo electrónico del nuevo usuario' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'El rol del nuevo usuario' })
  @IsInt()
  @IsNotEmpty()
  role: number;
}

export class LoginDto {
  @ApiProperty({ description: 'El nombre de usuario para iniciar sesión' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'La contraseña del usuario para iniciar sesión' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
