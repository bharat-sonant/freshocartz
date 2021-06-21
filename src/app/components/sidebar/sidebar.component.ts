import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, observable } from 'rxjs';

//services
import { CommonService } from '../../services/common/common.service';
import { MapService } from '../../services/map/map.service';
import { ActivatedRoute, Router, NavigationEnd, RouterLink } from "@angular/router";
import { ToastrService } from 'ngx-toastr';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'design_app', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})

export class SidebarComponent implements OnInit {


  constructor( public httpService: HttpClient, private mapService: MapService, private commonService: CommonService, private toastr: ToastrService, public router: Router) { }


  ngOnInit() {
    
  }

}
