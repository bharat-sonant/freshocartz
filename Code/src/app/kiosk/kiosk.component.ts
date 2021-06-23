/// <reference types="@types/googlemaps" />
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//services
import { CommonService } from '../services/common/common.service';
import { MapService } from '../services/map/map.service';
import { ActivatedRoute, Router } from "@angular/router";
import { AppRoutingModule } from '../app.routing';

@Component({
  selector: 'app-kiosk',
  templateUrl: './kiosk.component.html',
  styleUrls: ['./kiosk.component.scss']
})
export class KioskComponent {

  kioskUrl = 'https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk?limit=100000&offset=0&key=0xxKaLrOsI5V0biM7KprDa7CDFw51SPz5Tz7oQ6g';   // URL to web api

  @ViewChild('gmap', null) gmap: any;
  public map: google.maps.Map;

  kioskList: any[];
  farmerList: any[];
  selectedKiosk: any;
  allMarkers: any[];
  bounds: any;
  preIndex: any;
  markerList: any[];
  kioskMarker: any;


  constructor(public httpService: HttpClient, private actRoute: ActivatedRoute, private mapService: MapService, private commonService: CommonService) { }

  public selectedZone: any;
  pageDetail: detail =
    {
      kioskName: "",
      kioskMobile: "",
      kioskAddress: "",
      totalFarmers: 0,
      kioskTotal: 0,
      farmerName: "",
      farmerEmail: "",
      farmerMobile: "",
      farmerAddress: ""
    };

  ngOnInit() {
    this.setHeight();
    this.setMaps();
    this.getKiosk();
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

  getKiosk() {
    let isFirst = true;
    this.kioskList = [];
    this.allMarkers = [];
    this.markerList = [];
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
              if (kioskData[i]["kioskAddress"]["village"] != null) {
                address += ", " + kioskData[i]["kioskAddress"]["village"];
              }
              if (kioskData[i]["kioskAddress"]["pincode"] != null) {
                address += "-" + kioskData[i]["kioskAddress"]["pincode"];
              }
              if (kioskData[i]["kioskAddress"]["latitude"] != null) {
                lat = kioskData[i]["kioskAddress"]["latitude"];
                lng = kioskData[i]["kioskAddress"]["longitude"];
                let markerURL = "../assets/img/kiosk.png";
                this.markerList.push({ id: kioskId, lat: lat, lng: lng, markerURL: markerURL, type: 'kiosk' });
                this.kioskList.push({ kioskId: kioskId, name: name, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
                if (isFirst == true) {
                  isFirst = false;
                  $('#divKiosk').show();
                  this.preIndex = 0;
                  let details = this.kioskList.find(item => item.kioskId == kioskId);
                  if (details != undefined) {
                    this.pageDetail.kioskName = details.name;
                    this.pageDetail.kioskAddress = details.address;
                    this.pageDetail.kioskMobile = details.mobile;
                  }
                  let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + kioskId + "/farmer?limit=0&offset=0";
                  this.httpService.get(url).subscribe((res) => {
                    let data = res;
                    if (res != null) {
                      this.pageDetail.totalFarmers = Number(data["count"]);
                    }
                  })
                }
              }
            }
          }
          this.getMarkerList();
        }
      }
    });
  }

  getMarkerList() {
    this.bounds = new google.maps.LatLngBounds();
    if (this.markerList.length > 0) {
      for (let i = 0; i < this.markerList.length; i++) {
        let isSelected = false;
        if (i == 0) {
          isSelected = true;
          this.preIndex = 0;
        }

        this.setMarker(this.markerList[i]["lat"], this.markerList[i]["lng"], this.markerList[i]["markerURL"], this.markerList[i]["id"], isSelected, i, this.markerList[i]["type"]);
        this.bounds.extend({ lat: Number(this.markerList[i]["lat"]), lng: Number(this.markerList[i]["lng"]) });
      }
    }
    setTimeout(() => {
      this.addLisnerOnMarkers(this.allMarkers, this.markerList, this.markerList[0]["type"]);
    }, 600);
    if (this.markerList[0]["type"] == "kiosk") {
      this.map.fitBounds(this.bounds);
    }
  }


  setMarker(lat: any, lng: any, markerURL: any, id: any, isSelected: any, index: any, type: any) {
    let height = 25;
    let width = 25;
    if (type == "kiosk") {
      height = 25;
      width = 30;
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
    if (isSelected == true) {
      marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    this.allMarkers.push({ marker });
  }

  addLisnerOnMarkers(markerList: any, list: any, type: any) {
    if (type == "kiosk") {
      let kioskList = this.kioskList;
      let pageDetails = this.pageDetail;
      let httpServices = this.httpService;
      let preIndex = this.preIndex;
      for (let i = 0; i < markerList.length; i++) {
        markerList[i]["marker"].addListener('click', function () {
          $('#divKiosk').show();
          let details = kioskList.find(item => item.kioskId == list[i]["id"]);
          if (details != undefined) {
            pageDetails.kioskName = details.name;
            pageDetails.kioskAddress = details.address;
            pageDetails.kioskMobile = details.mobile;
          }
          let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + list[i]["id"] + "/farmer?limit=0&offset=0";
          httpServices.get(url).subscribe((res) => {
            let data = res;
            if (res != null) {
              pageDetails.totalFarmers = Number(data["count"]);
            }
          });
          KioskComponent.prototype.setSelectedMarker(i, markerList);
        });
      }
    }
    else if (type == "farmer") {
      let details = this.pageDetail;
      let httpServices = this.httpService;
      for (let i = 0; i < markerList.length; i++) {
        markerList[i]["marker"].addListener('click', function () {
          let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/farmer/" + list[i]["id"] + "";
          httpServices.get(url).subscribe((res) => {
            let data = res;
            if (res != null) {
              let element = <HTMLElement>document.getElementById('divKiosk');
              let height = element.clientHeight + 70 + 10;
              $('#divFarmer').show();
              $('#divFarmer').css('top', height);
              details.farmerEmail = data["email"];
              details.farmerName = data["firstName"];
              if (data["middleName"] != null) {
                details.farmerName = details.farmerName + " " + data["middleName"]
              }
              if (data["lastName"] != null) {
                details.farmerName = details.farmerName + " " + data["lastName"];
              }
              if (data["mobileNumber"] != null) {
                details.farmerMobile = data["mobileNumber"];
              }
              else {
                details.farmerMobile = "";
              }
              if (data["farmerAddress"] != null) {
                if (data["farmerAddress"]["addressLine1"] != null) {
                  details.farmerAddress = data["farmerAddress"]["addressLine1"];
                }
                if (data["farmerAddress"]["addressLine2"] != null) {
                  details.farmerAddress += ", " + data["farmerAddress"]["addressLine2"];
                }
                if (data["farmerAddress"]["village"] != null) {
                  details.farmerAddress += ", " + data["farmerAddress"]["village"];
                }
                if (data["farmerAddress"]["pincode"] != null) {
                  details.farmerAddress += " - " + data["farmerAddress"]["pincode"];
                }
              }
              else {
                details.farmerAddress = "";
              }
            }
          });
          KioskComponent.prototype.setSelectedMarker(i, markerList);
        });

      }

    }
  }

  setSelectedMarker(index: any, markerList: any) {
    for (let i = 0; i < markerList.length; i++) {
      if (i == index) {
        markerList[i]["marker"].setAnimation(google.maps.Animation.BOUNCE);
      }
      else {
        markerList[i]["marker"].setAnimation(null);
      }
    }
  }


  getFarmers() {
    let kioskLat = 0;
    let kioskLng = 0;
    this.markerList = [];
    this.farmerList = [];
    let kioskDetails = this.kioskList.find(item => item.kioskId == this.selectedKiosk);
    if (kioskDetails != undefined) {
      if (kioskDetails.lat != "") {
        kioskLat = Number(kioskDetails.lat);
        kioskLng = Number(kioskDetails.lng);
        let markerURL = "../assets/img/kiosk.png";
        let marker = new google.maps.Marker({
          position: { lat: kioskLat, lng: kioskLng },
          map: this.map,
          icon: {
            url: markerURL,
            fillOpacity: 1,
            strokeWeight: 0,
            scaledSize: new google.maps.Size(25, 30),
            origin: new google.maps.Point(0, 0)
          }
        });
        let centerPoint = new google.maps.LatLng(kioskLat, kioskLng);
        this.map.setZoom(16);
        this.map.setCenter(centerPoint);
        this.kioskMarker = marker;
      }
    }
    this.farmerList = [];
    let farmerUrl = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + this.selectedKiosk + "/farmer?limit=100000&offset=0";
    this.httpService.get(farmerUrl).subscribe((res) => {
      let data = res;
      if (data != null) {
        this.pageDetail.totalFarmers = data["count"];
        let farmerData = data["rows"];
        if (farmerData.length > 0) {
          for (let i = 0; i < farmerData.length; i++) {
            let markerURL = "../assets/img/farmer.png";
            let farmerId = farmerData[i]["farmerId"];
            let lat = 0;
            let lng = 0;
            if (farmerData[i]["farmerAddress"] != null) {
              if (farmerData[i]["farmerAddress"]["latitude"] != null) {
                lat = farmerData[i]["farmerAddress"]["latitude"];
                lng = farmerData[i]["farmerAddress"]["longitude"];
                this.markerList.push({ id: farmerId, lat: lat, lng: lng, markerURL: markerURL, type: 'farmer' });
              }
              else {
                const EARTH_RADIUS = 6378;
                var y0 = kioskLat;
                var x0 = kioskLng;
                var rd = EARTH_RADIUS / 111300; //about 111300 meters in one degree

                var u = Math.random();
                var v = Math.random();

                var w = rd * Math.sqrt(u);
                var t = 2 * Math.PI * v;
                var x = w * Math.cos(t);
                var y = w * Math.sin(t);

                //Adjust the x-coordinate for the shrinking of the east-west distances
                var xp = x / Math.cos(y0);

                var newlat = y + y0;
                var newlon = x + x0;
                var newlon2 = xp + x0;
                lat = newlat;
                lng = newlon;
                this.markerList.push({ id: farmerId, lat: lat, lng: lng, markerURL: markerURL, type: 'farmer' });
              }
            }
            else {
              const EARTH_RADIUS = 6378;
              var y0 = kioskLat;
              var x0 = kioskLng;
              var rd = EARTH_RADIUS / 111300; //about 111300 meters in one degree

              var u = Math.random();
              var v = Math.random();

              var w = rd * Math.sqrt(u);
              var t = 2 * Math.PI * v;
              var x = w * Math.cos(t);
              var y = w * Math.sin(t);

              //Adjust the x-coordinate for the shrinking of the east-west distances
              var xp = x / Math.cos(y0);

              var newlat = y + y0;
              var newlon = x + x0;
              var newlon2 = xp + x0;
              lat = newlat;
              lng = newlon;

              this.markerList.push({ id: farmerId, lat: lat, lng: lng, markerURL: markerURL, type: 'farmer' });
            }
            this.farmerList.push({ farmerId: farmerId, lat: lat, lng: lng });
          }
          this.getMarkerList();
        }
      }
    });

  }


  clearAll() {
    this.pageDetail.kioskAddress = "";
    this.pageDetail.kioskMobile = "";
    this.pageDetail.kioskName = "";
    this.pageDetail.totalFarmers = 0;
    if (this.kioskMarker != null) {
      this.kioskMarker.setMap(null);
    }
    $('#divFarmer').hide();
    if (this.allMarkers.length > 0) {
      for (let i = 0; i < this.allMarkers.length; i++) {
        this.allMarkers[i]["marker"].setMap(null);
      }
    }
    this.allMarkers = [];
    this.farmerList = [];
    this.markerList = [];
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
    this.farmerList = [];
    this.markerList = [];
    if (this.kioskList.length > 0) {
      for (let i = 0; i < this.kioskList.length; i++) {
        if (this.kioskList[i]["lat"] != "") {
          let markerUrl = "../assets/img/kiosk.png";
          if (i == 0) {
            $('#divKiosk').show();
            let kioskDetails = this.kioskList.find(item => item.kioskId == this.kioskList[0]["kioskId"]);
            if (kioskDetails != undefined) {
              this.pageDetail.kioskName = kioskDetails.name;
              this.pageDetail.kioskAddress = kioskDetails.address;
              this.pageDetail.kioskMobile = kioskDetails.mobile;
            }
          }
          this.markerList.push({ id: this.kioskList[i]["kioskId"], lat: this.kioskList[i]["lat"], lng: this.kioskList[i]["lng"], markerURL: markerUrl, type: 'kiosk' });
        }
      }
      this.getMarkerList();
    }
  }
}

export class detail {
  kioskName: string;
  kioskMobile: string;
  kioskAddress: string;
  kioskTotal: number;
  totalFarmers: number;
  farmerName: string;
  farmerEmail: string;
  farmerMobile: string;
  farmerAddress: string;
}
