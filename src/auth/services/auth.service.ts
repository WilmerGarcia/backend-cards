import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Knex } from 'knex';
import { RegisterDto, LoginDto } from '../DTOS/dto';
import { LoggerService } from 'src/common/logger/logger.service';
import { ResponseStatus } from 'src/common/enum/response-status.enum';
import { Response } from 'src/common/interface/response.interface';
import { createResponse } from 'src/common/utils/response.util';
import {
  GetUser,
  Role,
  User,
  UserRole,
} from 'src/common/interface/user.interface';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @Inject('KNEX_CONNECTION') private readonly knex: Knex,
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Response<GetUser>> {
    const { username, password, email, role } = registerDto;
    const trx = await this.knex.transaction();

    try {
      const existingUser = (await trx('users')
        .where({ username })
        .first()) as User;
      if (existingUser) {
        return createResponse(
          ResponseStatus.ERROR,
          'El nombre de usuario ya está en uso',
        );
      }

      const existingEmail = (await trx('users')
        .where({ email })
        .first()) as User;
      if (existingEmail) {
        return createResponse(
          ResponseStatus.ERROR,
          'El correo electrónico ya está en uso',
        );
      }

      const roleExists = (await trx('roles')
        .where({ id: role })
        .first()) as Role;
      if (!roleExists) {
        return createResponse(
          ResponseStatus.ERROR,
          'El rol proporcionado no existe',
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const [userId] = await trx('users').insert({
        username,
        email,
        password: hashedPassword,
      });

      await trx('user_roles').insert({
        user_id: userId,
        role_id: role,
      });

      const newUser = (await trx('users')
        .where({ id: userId })
        .select('id', 'username', 'email')
        .first()) as GetUser;

      await trx.commit();

      this.logger.log(`Usuario registrado con ID: ${userId}`, 'database');

      return createResponse(
        ResponseStatus.SUCCESS,
        'Usuario registrado con éxito',
        newUser,
      );
    } catch (error) {
      await trx.rollback();
      this.logger.log(`Error al registrar usuario: ${error}`, 'error');
      return createResponse(ResponseStatus.ERROR, 'Error al registrar usuario');
    }
  }

  async login(loginDto: LoginDto): Promise<Response<any>> {
    const { username, password } = loginDto;
    const trx = await this.knex.transaction();

    try {
      const user: User = (await trx('users')
        .where({ username })
        .first()) as User;

      if (!user) {
        return createResponse(ResponseStatus.ERROR, 'Usuario no encontrado');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return createResponse(ResponseStatus.ERROR, 'Contraseña incorrecta');
      }
      const userRole = (await trx('user_roles')
        .where({ user_id: user.id })
        .first()) as UserRole;

      if (!userRole) {
        return createResponse(
          ResponseStatus.ERROR,
          'Rol no asignado al usuario',
        );
      }

      const role = (await trx('roles')
        .where({ id: userRole.role_id })
        .first()) as Role;

      if (!role) {
        return createResponse(ResponseStatus.ERROR, 'Rol no encontrado');
      }

      const userWithRole = {
        id: user.id,
        username: user.username,
        role: role,
      };

      await trx.commit();

      const payload = {
        id: userWithRole.id,
        username: userWithRole.username,
        role: userWithRole.role,
      };
      const jwtSecret: string =
        this.configService.get<string>('JWT_SECRET') || 'your_jwt_secret_key';
      const token = jwt.sign(payload, jwtSecret, {
        expiresIn: '1h',
      });

      this.logger.log(`Login exitoso para el usuario: ${username}`, 'database');
      return createResponse(ResponseStatus.SUCCESS, 'Login exitoso', {
        token,
      });
    } catch (error) {
      await trx.rollback();
      this.logger.log(`Error al realizar login: ${error}`, 'error');
      return createResponse(ResponseStatus.ERROR, 'Error al realizar login');
    }
  }
}