import { Routes } from '@angular/router';

import { MapsComponent } from '../../maps/maps.component';
import { HomeComponent } from '../../home/home.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'maps/:id', component: MapsComponent },
    { path: 'maps', component: MapsComponent },
]; 
