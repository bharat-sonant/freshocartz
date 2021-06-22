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
                let contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
                contentString += 'font-size: 14px;padding:2px"><b>' + name + "</b><br/>" + address + '</div>';
                
                this.setMarker(lat, lng, markerUrl, contentString, "kiosk", 0, this.farmerList);
                this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
              }
              this.kioskList.push({ kioskId: kioskId, name: name, address: address, lat: lat, lng: lng, pinCode: pinCode, village: village, mobile: mobile });
            }
          }
          this.map.fitBounds(this.bounds);
        }
      }
    });
  }


  getFarmers() {
    this.bounds = new google.maps.LatLngBounds();
    this.farmerList = [];
    let farmerUrl = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + this.selectedKiosk + "/farmer?limit=100000&offset=0";
    this.httpService.get(farmerUrl).subscribe((res) => {
      let data = res;
      if (data != null) {
        this.pageDetail.totalFarmers = data["count"];
        let farmerData = data["rows"];
        if (farmerData.length > 0) {
          for (let i = 0; i < farmerData.length; i++) {
            let markerUrl = "../assets/img/green.svg";
            let contentString="";
            let farmerId = farmerData[i]["farmerId"];
            let lat = "";
            let lng = "";
            if (farmerData[i]["farmerAddress"] != null) {
              if (farmerData[i]["farmerAddress"]["latitude"] != null) {
                lat = farmerData[i]["farmerAddress"]["latitude"];
                lng = farmerData[i]["farmerAddress"]["longitude"];
                console.log(lat)
                this.setMarker(lat, lng, markerUrl, contentString, "farmer", farmerId, this.farmerList);
                this.bounds.extend({ lat: Number(lat), lng: Number(lng) });
                this.map.fitBounds(this.bounds);
              }
            }
            
            this.farmerList.push({ farmerId: farmerId, lat: lat, lng: lng});
          }

        }
      }
    });
    let kioskDetails = this.kioskList.find(item => item.kioskId == this.selectedKiosk);
    if (kioskDetails != undefined) {
      if (kioskDetails.lat != "") {
        let markerUrl = "../assets/img/kiosk.png";
        let contentString = '<div style="min-height: 35px;min-width: 35px;text-align: center;'
        contentString += 'font-size: 14px;padding:2px"><b>' + kioskDetails.name + "</b><br/>" + kioskDetails.address + '</div>';
        this.setMarker(kioskDetails.lat, kioskDetails.lng, markerUrl, contentString, "kiosk", 0, this.farmerList);
        this.bounds.extend({ lat: Number(kioskDetails.lat), lng: Number(kioskDetails.lng) });
        this.map.fitBounds(this.bounds);
      }
    }
  }

  setMarker(lat: any, lng: any, markerURL: any, contentString: any, type: any, farmerId: any, farmerList: any) {
    let height = 50;
    let width = 50;
    if (type == "kiosk") {
      height = 35;
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

    if (type == "farmer") {
      let details = this.pageDetail;
      let httpServices = this.httpService;
      marker.addListener('click', function () {
        let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/farmer/" + farmerId + "";
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
      let infowindow = new google.maps.InfoWindow({
        content: contentString
      });
      marker.addListener('click', function () {
        infowindow.open(this.map, marker);
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
