import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  PublicClientApplication
} from "@azure/msal-browser";
import {environment as E} from "./environment.prod";
import {MsalGuardConfiguration, MsalInterceptorConfiguration} from "@azure/msal-angular";

const isIE = window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;

export function MsalInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: E.clientID,
      authority: 'https://login.windows.net/' + E.tenantID,
      redirectUri: 'http://localhost:4200', // if login type is redirect
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: isIE // Set to true for Internet Explorer 11
    },
  })
}

export function MsalGuardConfFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // redirect user to login page if not logged in
    authRequest: {scopes: ['user.read']}
  } as MsalGuardConfiguration;
}

export function MsalInterceptorConfFactory(): MsalInterceptorConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap: new Map([[E.graph, ['user.read']]])
  } as MsalInterceptorConfiguration
}
