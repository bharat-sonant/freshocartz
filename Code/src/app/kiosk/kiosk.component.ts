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


  getKiosk() {
    let isFirst = true;
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
                let markerUrl = "../assets/img/kiosk.png";
                let markerList = this.allMarkers;
                this.kioskList.push({ kioskId: kioskId, name: name, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
                this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
                if (isFirst == true) {
                  isFirst = false;
                  $('#divKiosk').show();
                  this.preIndex = 0;
                  this.setMarker(lat, lng, markerUrl, "kiosk", kioskId, true, 0, markerList);
                  let details = this.kioskList.find(item => item.kioskId == kioskId);
                  if (details != undefined) {
                    this.pageDetail.kioskName = details.name;
                    this.pageDetail.kioskAddress = details.address;
                    this.pageDetail.kioskMobile = details.mobile;
                  }
                }
                else {
                  this.setMarker(lat, lng, markerUrl, "kiosk", kioskId, false, this.allMarkers.length - 1, markerList);
                }
              }
            }
          }
          this.map.fitBounds(this.bounds);
        }
      }
    });
  }

  getFarmers() {
    this.bounds = new google.maps.LatLngBounds();
    let kioskLat = 0;
    let kioskLng = 0;
    let kioskDetails = this.kioskList.find(item => item.kioskId == this.selectedKiosk);
    if (kioskDetails != undefined) {
      if (kioskDetails.lat != "") {
        kioskLat = Number(kioskDetails.lat);
        kioskLng = Number(kioskDetails.lng);
        let markerList = this.allMarkers;
        let markerUrl = "../assets/img/kiosk.png";
        this.setMarker(kioskDetails.lat, kioskDetails.lng, markerUrl, "kiosk", this.selectedKiosk, false, -1, markerList);
        this.bounds.extend({ lat: Number(kioskDetails.lat), lng: Number(kioskDetails.lng) });
        this.map.fitBounds(this.bounds);
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
            let markerUrl = "../assets/img/farmer.png";
            let contentString = "";
            let farmerId = farmerData[i]["farmerId"];
            let lat = 0;
            let lng = 0;
            if (farmerData[i]["farmerAddress"] != null) {
              if (farmerData[i]["farmerAddress"]["latitude"] != null) {
                lat = farmerData[i]["farmerAddress"]["latitude"];
                lng = farmerData[i]["farmerAddress"]["longitude"];
                let markerList = this.allMarkers;
                this.setMarker(lat, lng, markerUrl, "farmer", farmerId, false, -1, markerList);
                this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
                this.map.fitBounds(this.bounds);
              }
              else {
                const EARTH_RADIUS = 6378;
                var y0 = kioskLat;
                var x0 = kioskLng;
                var rd = EARTH_RADIUS / 111300; //about 111300 meters in one degree

                var u = Math.random();
                var v = Math.random();
               // console.log("u" + u);
               // console.log("v" + v);

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


                // distance

              //  var R = 6371; // km
              //  var dLat = this.toRad(lat - kioskLat);
             //   var dLon = this.toRad(lng - kioskLng);
             //   var lat1 = this.toRad(kioskLat);
              //  var lat2 = this.toRad(lat);

              //  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
             //     Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
              //  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
              //  var d = R * c;
             //   console.log("distance " + d);




                // Random random = new Random();

                ///  lat = kioskLat + (5 / EARTH_RADIUS) * (180 / Math.PI);
                //  lng = kioskLng + (5 / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(kioskLat * Math.PI / 180);
                //console.log("lat:" + lat);
                // console.log("lng:" + lng);
                let markerList = this.allMarkers;
                this.setMarker(lat, lng, markerUrl, "farmer", farmerId, false, -1, markerList);
                this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
                this.map.fitBounds(this.bounds);
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





              // Random random = new Random();

              ///  lat = kioskLat + (5 / EARTH_RADIUS) * (180 / Math.PI);
              //  lng = kioskLng + (5 / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(kioskLat * Math.PI / 180);
              //  console.log("lat:" + lat);
              //  console.log("lng:" + lng);
              let markerList = this.allMarkers;
              this.setMarker(lat, lng, markerUrl, "farmer", farmerId, false, -1, markerList);
              this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
              this.map.fitBounds(this.bounds);
            }
            this.farmerList.push({ farmerId: farmerId, lat: lat, lng: lng });
          }
        }
      }
    });

  }

  toRad(Value: any) {
    return Value * Math.PI / 180;
  }

  setMarker(lat: any, lng: any, markerURL: any, type: any, id: any, isSelected: any, index: any, markerList: any) {
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
      // marker.setAnimation(google.maps.Animation.BOUNCE);
    }

    if (type == "farmer") {
      let details = this.pageDetail;
      let httpServices = this.httpService;

      marker.addListener('click', function () {
        let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/farmer/" + id + "";
        httpServices.get(url).subscribe((res) => {
          let data = res;
          if (res != null) {
            $('#divFarmer').show();
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
      });
    }
    else {
      let pageDetails = this.pageDetail;
      let kioskList = this.kioskList;

      marker.addListener('click', function () {
        // infowindow.open(this.map, marker);
        $('#divKiosk').show();
        let details = kioskList.find(item => item.kioskId == id);
        if (details != undefined) {
          pageDetails.kioskName = details.name;
          pageDetails.kioskAddress = details.address;
          pageDetails.kioskMobile = details.mobile;
        }
        //KioskComponent.prototype.setSelectedMarker(index,markerList);
      });
    }
    this.allMarkers.push({ marker });
  }

  setSelectedMarker(index: any, markerList: any) {
    // console.log(index);
    //console.log(markerList.length);

    markerList[index]["marker"].setMap(null);


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
        if (this.kioskList[i]["lat"] != "") {
          let markerUrl = "../assets/img/kiosk.png";
          let isSelected = false;
          if (i == 0) {
            isSelected = true;
            $('#divKiosk').show();
            let kioskDetails = this.kioskList.find(item => item.kioskId == this.kioskList[0]["kioskId"]);
            if (kioskDetails != undefined) {
              this.pageDetail.kioskName = kioskDetails.name;
              this.pageDetail.kioskAddress = kioskDetails.address;
              this.pageDetail.kioskMobile = kioskDetails.mobile;
            }
          }
          let markerList = this.allMarkers;
          this.setMarker(this.kioskList[i]["lat"], this.kioskList[i]["lng"], markerUrl, "kiosk", this.kioskList[i]["kioskId"], isSelected, 0, markerList);
          this.bounds.extend({ lat: Number(this.kioskList[i]["lat"]), lng: Number(this.kioskList[i]["lng"]) });
        }
      }
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
  farmerName: string;
  farmerEmail: string;
  farmerMobile: string;
  farmerAddress: string;
}
