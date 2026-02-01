import {
  ApplicationConfig,
  inject,
  Injector,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withFetch, withInterceptors} from '@angular/common/http';
import {providePrimeNG} from 'primeng/config';
import {myCustomPreset} from '@cinemabooking/my-theme';
import {credentialsInterceptor} from '@cinemabooking/interceptors/credentials.interceptor';
import {AuthStore} from '@cinemabooking/stores/auth.store';
import {InterpolatableTranslationObject, provideTranslateService, TranslateService} from '@ngx-translate/core';
import {ConfirmationService, MessageService} from 'primeng/api';
import {provideTranslateHttpLoader} from '@ngx-translate/http-loader';
import {LOCATION_INITIALIZED} from '@angular/common';
import {lastValueFrom, tap} from 'rxjs';

export async function i18nInitializer(): Promise<InterpolatableTranslationObject> {
  const translate = inject(TranslateService);
  const injector = inject(Injector);

  await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

  const langToSet = 'en';
  translate.addLangs(['pl', 'en']);
  translate.setFallbackLang(langToSet);

  return lastValueFrom(
    translate.use(langToSet).pipe(
      tap({
        next: () => {
          console.log(`Successfully initialized '${langToSet}' language.`);
        },
        error: (err) => {
          console.error(`Problem with '${langToSet}' language initialization.`, err);
        }
      })
    )
  );
}

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    ConfirmationService,
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),

    provideHttpClient(withFetch(), withInterceptors([credentialsInterceptor])),

    providePrimeNG({
      theme: {
        preset: myCustomPreset,
        options: {
          darkModeSelector: '.dark-theme',
          cssLayer: {
            name: 'primeng',
            order: 'theme, base, primeng'
          }
        }
      }
    }),
    provideTranslateService({
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',
        suffix: '.json',
      }),
      fallbackLang: 'pl',
      lang: 'pl',
    }),
    provideAppInitializer(() => {
      const authStore = inject(AuthStore);
      authStore.checkAuth();
    }),
    provideAppInitializer(i18nInitializer),
  ]
};
