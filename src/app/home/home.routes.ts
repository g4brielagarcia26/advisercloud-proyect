import { Routes } from "@angular/router";
import { privateGuard } from "../core/guards/auth.guards";

// Aquí definimos todas las rutas del Home.

export default [
  {
    path: '',
    loadComponent: () => import('./shared-components/layout/layout.component'),
    children:[
      {
        path:'tool-panel',
        loadComponent: () => import('./tools/tool-panel/tool-panel.component')
      }
    ]
  }
] as Routes