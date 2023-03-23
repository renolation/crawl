import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TruyenModule } from './truyen/truyen.module';
import {MongooseModule} from "@nestjs/mongoose";

@Module({
  imports: [
      TruyenModule,
      MongooseModule.forRootAsync({
          useFactory: () => ({
              uri: 'mongodb+srv://phuoc:pamobile123@cluster0.rgtomto.mongodb.net/truyen',
          }),
      }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
