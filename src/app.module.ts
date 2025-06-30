import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { ReviewModule } from './modules/review/review.module';
import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { CoreModule } from 'src/core/core.module';
import TransformInterceptor from './core/intersector/transform.interceptor';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './core/guards/auth.guard';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    AdminModule,
    UserModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    ReviewModule,
    AdvertisementModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
