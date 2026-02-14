import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredLevels = this.reflector.get<number[]>('roles', context.getHandler());
    if (!requiredLevels) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    
    // user.level нь JwtStrategy-аас ирж буй утга байна
    if (!requiredLevels.includes(user.level)) {
      throw new ForbiddenException('Танд энэ үйлдлийг хийх эрх байхгүй (Зөвхөн ХАБЭА ажилтан)');
    }
    return true;
  }
}