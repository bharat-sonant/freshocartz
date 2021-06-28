import { Routes } from '@angular/router';

import { HomeComponent } from '../../home/home.component';
import { KioskComponent } from '../../kiosk/kiosk.component';
import { StaffTrackingComponent } from '../../staff-tracking/staff-tracking.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'home', component: HomeComponent },
    { path: 'kiosk', component: KioskComponent },
    { path: 'staff-tracking', component: StaffTrackingComponent },
]; 
