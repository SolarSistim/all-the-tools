import { Routes } from '@angular/router';
import { resourceResolver } from './resolvers/resource.resolver';

export const RESOURCES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/resources-listing/resources-listing.component').then(
        (m) => m.ResourcesListingComponent
      ),
    title: 'Resources | All The Things',
  },
  {
    path: ':slug',
    resolve: {
      resource: resourceResolver,
    },
    loadComponent: () =>
      import('./components/resource-page/resource-page.component').then(
        (m) => m.ResourcePageComponent
      ),
    title: 'Resource | All The Things',
  },
];
