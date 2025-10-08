import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
//importaciones para trabajar comunicación con HTTP y graphql con Apollo
import { provideHttpClient } from '@angular/common/http';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
// Corregir la importación de APOLLO_OPTIONS
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { routes } from './app.routes';

//URI del servidor GraphQL de Laravel
const uri = 'http://127.0.0.1:8000/graphql';

//Función para crear la configuración de Apollo
export function createApollo(HttpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: HttpLink.create({ uri }),
    cache: new InMemoryCache(),
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    //Configuraciones para trabajar con HTTP y Apollo
    provideHttpClient(),

    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }
  ]
};