import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';




// Create Auth Guard
// This guard will protect routes from unauthorized users
export const authGuard: CanActivateFn = (route, state) => {

  // Inject Angular Router
  // Used for redirecting user to another page
  const router = inject(Router);


  // Get logged in user data from localStorage
  // localStorage stores data as string
  const userData = localStorage.getItem('user');


  // Check if user exists in localStorage
  // If no user found, user is not logged in
  if (!userData) {

    // Redirect user to login page
    router.navigate(['/login']);

    // Block route access
    return false;

  }


  // Convert string data into JavaScript object
  const user = JSON.parse(userData);


  // Get required role from route configuration
  // Example:
  // data: { role: 'Admin' }
  const expectedRole = route.data?.['role'];


  // Check if route has role restriction
  // AND user's role does not match required role
  if (expectedRole && user.role !== expectedRole) {

    // Show warning message
    alert('Unauthorized Access');


    // Redirect user to login page
    router.navigate(['/login']);


    // Deny route access
    return false;

  }

  // If everything is valid:
  // - user is logged in
  // - user has correct role
  // Then allow route access
  return true;

};