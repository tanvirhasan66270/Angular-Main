import {
  ApplicationConfig,
  provideClientHydration, // Removed: provideBrowserGlobalErrorListeners as it's not used
  provideHttpClient
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Added HttpClient provider
  ],
};
