import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
//importaciones para trabajar comunicación con HTTP y graphql con Apollo
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { InMemoryCache } from '@apollo/client/core';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

//URI del servidor GraphQL de Laravel
const uri = 'http://127.0.0.1:8000/graphql';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    //Configuraciones para trabajar con HTTP y Apollo
    provideHttpClient(),
    
    provideApollo(() => {
      const httpClient = inject(HttpClient);
      const httpLink = new HttpLink(httpClient);
      return {
        link: httpLink.create({ uri }),
        cache: new InMemoryCache(),
      };
    })
  ]
};