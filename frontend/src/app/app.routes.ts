import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Layout } from './pages/layout/layout';
import { Dashboard } from './pages/dashboard/dashboard';
import { Sigin } from './pages/sigin/sigin';
import { Restore } from './pages/restore/restore';
import { Profile } from './pages/profile/profile';

export const routes: Routes = [
    {
        path: '', redirectTo:'login', pathMatch: 'full'
    },
    {
        path: 'login', component:Login
    },
    {
        path: 'sigin', component: Sigin 
    },
    {
        path: 'restore', component: Restore
    },
    {
        path: 'dashboard', component: Dashboard
    },
    {
        path: 'layout', component:Layout
    },
    {
        path: 'profile', component: Profile
    },
];
