import { Module, OnModuleInit } from '@nestjs/common';
import * as knex from 'knex';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()], // Esto carga el archivo .env
  providers: [
    {
      provide: 'KNEX_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const db = knex({
          client: 'mysql2',
          connection: {
            host: configService.get<string>('DB_HOST'),
            user: configService.get<string>('DB_USER'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
          },
        });
        try {
          await db.raw('SELECT 1+1 AS result');
          console.log('¡Conexión a la base de datos exitosa!');
        } catch (error: unknown) {
          const errorMessage =
            typeof error === 'object' && error !== null && 'message' in error
              ? (error as { message: string }).message
              : String(error);
          console.error('Error al conectar a la base de datos:', errorMessage);
          process.exit(1);
        }

        return db;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['KNEX_CONNECTION'],
})
export class DatabaseModule implements OnModuleInit {
  onModuleInit() {
    console.log('Iniciando conexión a la base de datos...');
  }
}
