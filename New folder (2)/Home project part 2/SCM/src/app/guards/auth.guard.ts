import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../core/service/user-service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        // Not logged in, redirect to login
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }

      // Check if route has restricted roles
      const requiredRoles = route.data['roles'] as Array<string>;
      if (requiredRoles && !requiredRoles.includes(user.role)) {
        // Role not authorized, redirect to home or unauthorized page
        alert('You do not have permission to access this page.');
        router.navigate(['/']);
        return false;
      }

      // Authorized
      return true;
    })
  );
};
