import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../orm-config.js';
import { OperationsModule } from './modules/operations/operations.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), OperationsModule],
})
export class AppModule {}
