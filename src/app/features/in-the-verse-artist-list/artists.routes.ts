import { Routes } from '@angular/router';
import { artistResolver } from './resolvers/artist.resolver';

export const ARTISTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./in-the-verse-artist-list').then(
        (m) => m.InTheVerseArtistList
      ),
    title: 'In The Verse - 3D Artists Directory | All The Things',
  },
  {
    path: ':slug',
    resolve: {
      artist: artistResolver,
    },
    loadComponent: () =>
      import('./components/artist-detail/artist-detail.component').then(
        (m) => m.ArtistDetailComponent
      ),
    title: 'Artist | All The Things',
  },
];
