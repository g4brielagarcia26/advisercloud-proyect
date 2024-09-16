import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// Configuración del Firebase

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp({
      projectId: "advisercloud-project-a027e",
      appId: "1:883159671359:web:90af33a3f607438deb0e8a",
      storageBucket: "advisercloud-project-a027e.appspot.com",
      apiKey: "AIzaSyAzknXGpiaI4A_8nXstxHbGQ5dtnaAlhEo",
      authDomain: "advisercloud-project-a027e.firebaseapp.com",
      messagingSenderId: "883159671359"
    })),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ]
};

