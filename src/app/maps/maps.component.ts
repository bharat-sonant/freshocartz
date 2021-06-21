/// <reference types="@types/googlemaps" />

import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//services
import { CommonService } from '../services/common/common.service';
import { MapService } from '../services/map/map.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent {

  kioskUrl = 'https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk?limit=10&offset=0&key=0xxKaLrOsI5V0biM7KprDa7CDFw51SPz5Tz7oQ6g';   // URL to web api

  @ViewChild('gmap', null) gmap: any;
  public map: google.maps.Map;

  kioskList: any[];
  farmerList: any[];
  selectedKiosk: any;
  allMarkers: any[];

  constructor(public httpService: HttpClient, private actRoute: ActivatedRoute, private mapService: MapService, private commonService: CommonService) { }

  public selectedZone: any;


  ngOnInit() {
    this.setMaps();
    this.getKiosk();
  }


  /** GET heroes from the server */
  getKiosk() {
    this.kioskList = [];
    this.httpService.get(this.kioskUrl).subscribe((res) => {
      let data = res;
      let kioskData = data["rows"];
      if (kioskData.length > 0) {
        for (let i = 0; i < kioskData.length; i++) {
          let kioskId = kioskData[i]["kioskId"];
          let name = kioskData[i]["name"];
          let address = "";
          let lat = "";
          let lng = "";
          let pinCode = "";
          let village = "";
          let mobile = kioskData[i]["mobileNumber"];
          if (kioskData[i]["kioskAddress"] != null) {
            if (kioskData[i]["kioskAddress"]["addressLine1"] != null) {
              address = kioskData[i]["kioskAddress"]["addressLine1"];
            }
            if (kioskData[i]["kioskAddress"]["addressLine2"] != null) {
              address += ", " + kioskData[i]["kioskAddress"]["addressLine2"];
            }
            if (kioskData[i]["kioskAddress"]["village"] != "") {
              address += ", " + kioskData[i]["kioskAddress"]["village"];
            }
            if (kioskData[i]["kioskAddress"]["pincode"] != null) {
              address += "-" + kioskData[i]["kioskAddress"]["pincode"];
            }
            lat = kioskData[i]["kioskAddress"]["latitude"];
            lng = kioskData[i]["kioskAddress"]["longitude"];
          }
          this.kioskList.push({ kioskId: kioskId, name: name, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
        }
      }
    });
  }

  clearAll() {

  }

  changeKioskSelection() {
    this.selectedKiosk = $('#ddlKiosk').val();
    this.getFarmers();
  }

  getFarmers() {
    this.farmerList = [];
    let farmerUrl = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + this.selectedKiosk + "/farmer?limit=10&offset=0";
    this.httpService.get(farmerUrl).subscribe((res) => {
      let data = res;
      console.log(data);
    });
  }






  setHeight() {
    $('.navbar-toggler').show();
    $('#divMap').css("height", $(window).height() - 80);
  }


  setMaps() {
    var mapstyle = new google.maps.StyledMapType(
      [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: "off" }]
        },
      ]
    );
    let mapProp = this.commonService.initMapProperties();
    this.map = new google.maps.Map(this.gmap.nativeElement, mapProp);
    this.map.mapTypes.set('styled_map', mapstyle);
    this.map.setMapTypeId('styled_map');
  }

  onSubmit() {
  }


}
