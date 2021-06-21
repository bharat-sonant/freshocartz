/// <reference types="@types/googlemaps" />

import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { interval, Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//services
import { CommonService } from '../services/common/common.service';
import { MapService } from '../services/map/map.service';
import { ActivatedRoute, Router } from "@angular/router";
import { NumberValueAccessor } from '@angular/forms';
import { AppRoutingModule } from '../app.routing';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})

export class MapsComponent {

  kioskUrl = 'https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk?limit=100&offset=0&key=0xxKaLrOsI5V0biM7KprDa7CDFw51SPz5Tz7oQ6g';   // URL to web api

  @ViewChild('gmap', null) gmap: any;
  public map: google.maps.Map;

  kioskList: any[];
  farmerList: any[];
  selectedKiosk: any;
  allMarkers: any[];
  bounds: any;

  constructor(public httpService: HttpClient, private actRoute: ActivatedRoute, private mapService: MapService, private commonService: CommonService) { }

  public selectedZone: any;
  pageDetail: detail =
    {
      kioskName: "",
      kioskMobile: "",
      kioskAddress: "",
      totalFarmers: 0,
      kioskTotal: 0,
      farmerEmail: "",
      farmerMobile: "",
      farmerAddress: ""
    };

  ngOnInit() {
    this.setHeight();
    this.setMaps();
    this.getKiosk();
  }


  /** GET heroes from the server */
  getKiosk() {
    this.bounds = new google.maps.LatLngBounds();
    this.kioskList = [];
    this.allMarkers = [];
    this.httpService.get(this.kioskUrl).subscribe((res) => {
      let data = res;
      if (res != null) {
        let kioskData = data["rows"];
        this.pageDetail.kioskTotal = data["count"];
        if (kioskData.length > 0) {
          for (let i = 0; i < kioskData.length; i++) {
            let kioskId = kioskData[i]["kioskId"];
            let name = kioskData[i]["name"];
            let address = "";
            let lat = "27.635549";
            let lng = "75.11727";
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
              if (kioskData[i]["kioskAddress"]["village"] != null) {
                address += ", " + kioskData[i]["kioskAddress"]["village"];
              }
              if (kioskData[i]["kioskAddress"]["pincode"] != null) {
                address += "-" + kioskData[i]["kioskAddress"]["pincode"];
              }
              if (kioskData[i]["kioskAddress"]["latitude"] != null) {
                lat = kioskData[i]["kioskAddress"]["latitude"];
                lng = kioskData[i]["kioskAddress"]["longitude"];
              }
            }
            let markerUrl = "../assets/img/kiosk.png";
            let contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
            contentString += 'font-size: 14px;padding:2px"><b>' + name + "</b><br/>" + address + '</div>';
            this.kioskList.push({ kioskId: kioskId, name: name, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
            this.setMarker(lat, lng, markerUrl, contentString, "kiosk", 0, this.farmerList);
            this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
          }
          this.map.fitBounds(this.bounds);
        }
      }
    });
  }

  setMarker(lat: any, lng: any, markerURL: any, contentString: any, type: any, farmerId: any, farmerList: any) {
    let height=50;
    let width=50;
    if(type=="kiosk")
    {
      height=35;
      width=30;
    }
    let marker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      map: this.map,
      icon: {
        url: markerURL,
        fillOpacity: 1,
        strokeWeight: 0,
        scaledSize: new google.maps.Size(height, width),
        origin: new google.maps.Point(0, 0)
      }
    });
    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });
    if (type == "farmer") {
      let details = this.pageDetail;
      marker.addListener('click', function () {

        let farmerDetails = farmerList.find(item => item.farmerId == farmerId);
        if (farmerDetails != undefined) {
          details.farmerEmail = farmerDetails.email;
          details.farmerMobile = farmerDetails.mobile;
          details.farmerAddress = farmerDetails.address;
          $('#divFarmer').show();
        }
      });
    }
    this.allMarkers.push({ marker });
  }

  clearAll() {
    this.pageDetail.kioskAddress = "";
    this.pageDetail.kioskMobile = "";
    this.pageDetail.kioskName = "";
    this.pageDetail.totalFarmers = 0;
    $('#divFarmer').hide();
    if (this.allMarkers.length > 0) {
      for (let i = 0; i < this.allMarkers.length; i++) {
        this.allMarkers[i]["marker"].setMap(null);
      }
    }
  }

  changeKioskSelection() {
    this.clearAll();
    this.selectedKiosk = $('#ddlKiosk').val();
    if (this.selectedKiosk == "0") {
      $('#divKiosk').hide();
      this.setAllkiosk();
    }
    else {
      $('#divKiosk').show();
      let kioskDetails = this.kioskList.find(item => item.kioskId == this.selectedKiosk);
      if (kioskDetails != undefined) {
        this.pageDetail.kioskName = kioskDetails.name;
        this.pageDetail.kioskAddress = kioskDetails.address;
        this.pageDetail.kioskMobile = kioskDetails.mobile;
      }
    }
    this.getFarmers();
  }

  setAllkiosk() {
    this.bounds = new google.maps.LatLngBounds();
    this.farmerList = [];
    if (this.kioskList.length > 0) {
      for (let i = 0; i < this.kioskList.length; i++) {
        let markerUrl = "../assets/img/kiosk.png";
        let contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
        contentString += 'font-size: 14px;padding:2px"><b>' + this.kioskList[i]["name"] + "</b><br/>" + this.kioskList[i]["address"] + '</div>';
        this.setMarker(this.kioskList[i]["lat"], this.kioskList[i]["lng"], markerUrl, contentString, "kiosk", 0, this.farmerList);
        this.bounds.extend({ lat: Number(this.kioskList[i]["lat"]), lng: Number(this.kioskList[i]["lng"]) });
      }
      this.map.fitBounds(this.bounds);
    }
  }

  getFarmers() {
    this.bounds = new google.maps.LatLngBounds();

    this.farmerList = [];
    let farmerUrl = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + this.selectedKiosk + "/farmer?limit=100000&offset=0";
    this.httpService.get(farmerUrl).subscribe((res) => {
      let data = res;
      console.log(data);
      if (data != null) {
        this.pageDetail.totalFarmers = data["count"];
        let farmerData = data["rows"];
        if (farmerData.length > 0) {
          for (let i = 0; i < farmerData.length; i++) {
            let markerUrl = "../assets/img/green.svg";
            let contentString
            let farmerId = farmerData[i]["farmerId"];
            let email = farmerData[i]["email"];
            let address = "";
            let lat = "";
            let lng = "";
            let pinCode = "";
            let village = "";
            let mobile = farmerData[i]["mobileNumber"];
            if (farmerData[i]["farmerAddress"] != null) {
              if (farmerData[i]["farmerAddress"]["addressLine1"] != null) {
                address = farmerData[i]["farmerAddress"]["addressLine1"];
              }
              if (farmerData[i]["farmerAddress"]["addressLine2"] != null) {
                address += ", " + farmerData[i]["farmerAddress"]["addressLine2"];
              }
              if (farmerData[i]["farmerAddress"]["village"] != null) {
                address += ", " + farmerData[i]["farmerAddress"]["village"];
              }
              if (farmerData[i]["farmerAddress"]["pincode"] != null) {
                address += "-" + farmerData[i]["farmerAddress"]["pincode"];
              }
              if (farmerData[i]["farmerAddress"]["latitude"] != null) {
                lat = farmerData[i]["farmerAddress"]["latitude"];
                lng = farmerData[i]["farmerAddress"]["longitude"];
                contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
                contentString += 'font-size: 14px;padding:2px">' + address + '</div>';

                this.setMarker(lat, lng, markerUrl, contentString, "farmer", farmerId, this.farmerList);

              }

            }
            this.farmerList.push({ farmerId: farmerId, email: email, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
          }

        }
      }
    });
    let kioskDetails = this.kioskList.find(item => item.kioskId == this.selectedKiosk);
    if (kioskDetails != undefined) {
      let markerUrl = "../assets/img/kiosk.png";
      let contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
      contentString += 'font-size: 14px;padding:2px"><b>' + kioskDetails.name + "</b><br/>" + kioskDetails.address + '</div>';

      this.setMarker(kioskDetails.lat, kioskDetails.lng, markerUrl, contentString, "kiosk", 0, this.farmerList);
      this.bounds.extend({ lat: Number(kioskDetails.lat), lng: Number(kioskDetails.lng) });
      this.map.fitBounds(this.bounds);
    }
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
}


export class detail {
  kioskName: string;
  kioskMobile: string;
  kioskAddress: string;
  kioskTotal: number;
  totalFarmers: number;
  farmerEmail: string;
  farmerMobile: string;
  farmerAddress: string;
}
