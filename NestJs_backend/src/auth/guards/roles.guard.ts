
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    
    // If no user is attached to the request, deny access
    if (!user) {
      return false;
    }
    
    // Check if the route is a user profile update
    const request = context.switchToHttp().getRequest();
    const isProfileUpdate = 
      request.method === 'PUT' && 
      request.url.includes('/users/') && 
      request.params.id && 
      request.params.id === user.id;
    
    // Allow users to update their own profiles
    if (isProfileUpdate) {
      console.log('User is updating their own profile:', user.id);
      return true;
    }
    
    // Check if the user has one of the required roles
    return requiredRoles.some((role) => user.role === role);
  }
}
