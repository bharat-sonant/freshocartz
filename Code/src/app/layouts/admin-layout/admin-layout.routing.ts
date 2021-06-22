import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { KioskComponent } from '../../kiosk/kiosk.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'kiosk', component: KioskComponent },
]; 
