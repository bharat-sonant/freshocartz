/// <reference types="@types/googlemaps" />
import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//services
import { CommonService } from '../services/common/common.service';
import { MapService } from '../services/map/map.service';
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-staff-tracking',
  templateUrl: './staff-tracking.component.html',
  styleUrls: ['./staff-tracking.component.scss']
})
export class StaffTrackingComponent {
  kioskUrl = 'https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk?limit=100000&offset=0&key=0xxKaLrOsI5V0biM7KprDa7CDFw51SPz5Tz7oQ6g';   // URL to web api
  @ViewChild('gmap', null) gmap: any;
  public map: google.maps.Map;
  kioskList: any[];
  staffList: any[];
  selectedKiosk: any;
  selectedStaff: any;
  selectedDate: any;
  polylines: any[];
  allMarkers: any[] = [];
  lineDataList: any[] = [];

  vehicleMarker: any;
  lineIndex: any;
  isStart = false;
  speed: any;
  skip: any;
  startTime: any;
  endTime: any;


  constructor(public httpService: HttpClient, private actRoute: ActivatedRoute, private mapService: MapService, private commonService: CommonService) { }
  staffDetail: staffDetails =
    {
      name: "",
      mobile: "",
      email: "",
      address: "",
      distance: "0",
      time: "---"
    };
  ngOnInit() {
    this.lineIndex = 0;
    this.setHeight();
    this.setMaps();
    this.getKiosk();
  }


  setHeight() {
    $('.navbar-toggler').show();
    $('#divMap').css("height", $(window).height() - 80);
  }

  setMaps() {
    let mapProp = this.commonService.initMapProperties(true,true);
    this.map = new google.maps.Map(this.gmap.nativeElement, mapProp);
  }

  getKiosk() {
    let isFirst = true;
    this.kioskList = [];
    this.httpService.get(this.kioskUrl).subscribe((res) => {
      let data = res;
      if (res != null) {
        let kioskData = data["rows"];
        if (kioskData.length > 0) {
          for (let i = 0; i < kioskData.length; i++) {
            let kioskId = kioskData[i]["kioskId"];
            let name = kioskData[i]["name"];
            this.kioskList.push({ kioskId: kioskId, name: name });
          }
        }
      }
    }, (error) => {
      this.commonService.setAlertMessage("error", "No record found !!!");
    });
  }

  changeKioskSelection() {
    this.staffList = [];
    this.selectedKiosk = $('#ddlKiosk').val();
    if (this.selectedKiosk == "0") {
      this.commonService.setAlertMessage("error", "Please select kiosk !!!");
      return;
    }
    this.getStaffList();
    this.clearMap();
  }

  getStaffList() {
    this.selectedKiosk = "104";
    let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/kiosk/" + this.selectedKiosk + "/staff?limit=10000&offset=0";
    this.httpService.get(url).subscribe((res) => {
      if (res != null) {
        let data = res["rows"];
        if (data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let staffId = data[i]["staffId"];
            let name = data[i]["kioskStaffStaff"]["firstName"];
            this.staffList.push({ staffId: staffId, name: name });
          }
        }
      }
    }, (error) => {
      this.commonService.setAlertMessage("error", "No record found !!!");
    });
  }

  changeStaffSelection() {
    this.selectedStaff = $('#ddlStaff').val();
    if (this.selectedStaff == "0") {
      $('#divStaff').hide();
      this.commonService.setAlertMessage("error", "Please select staff !!!");
      return;
    }
    this.getStaffDetail();
    this.clearMap();
  }

  getStaffDetail() {
    this.selectedStaff = "25";
    let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/staff/" + this.selectedStaff;
    this.httpService.get(url).subscribe((res) => {
      if (res != null) {
        let name = res["firstName"];
        let email = "";
        let mobile = "";
        let address = "";
        if (res["email"] != null) {
          email = res["email"];
        }
        if (res["mobileNumber"] != null) {
          mobile = res["mobileNumber"];
        }
        if (res["staffAddress"]["addressLine1"] != null) {
          address = res["staffAddress"]["addressLine1"];
        }
        if (res["staffAddress"]["addressLine2"] != null) {
          address += ", " + res["staffAddress"]["addressLine2"];
        }
        if (res["staffAddress"]["village"] != null) {
          address += ", " + res["staffAddress"]["village"];
        }
        if (res["staffAddress"]["pincode"] != null) {
          address += " - " + res["staffAddress"]["pincode"];
        }
        this.staffDetail.name = name;
        this.staffDetail.email = email;
        this.staffDetail.mobile = mobile;
        this.staffDetail.address = address;
        $('#divStaff').show();
        this.getStaffLocation();
      }
    }, (error) => {
      this.staffDetail.name = "";
      this.staffDetail.email = "";
      this.staffDetail.mobile = "";
      this.staffDetail.address = "";
      $('#divStaff').hide();
      this.commonService.setAlertMessage("error", "No record found !!!");
    });

  }

  getStaffLocation() {
    this.selectedStaff = "40";
    this.selectedDate = "2021-01-27";
    let lat = "";
    let lng = "";
    let markerURL = "";
    let contentString = "";
    let lineData = [];
    this.polylines = [];
    this.lineDataList = [];
    this.startTime = "";
    this.endTime = "";

    let url = "https://0wybm6aze4.execute-api.ap-south-1.amazonaws.com/prod/staff/" + this.selectedStaff + "/movement?date=" + this.selectedDate + "";
    this.httpService.get(url).subscribe((res) => {
      if (res != null) {
        let data = Object.values(res);
        for (let i = 0; i < data.length; i++) {
          if (i == 0) {
            let time = data[i]["timestamp"].split('T')[1].toString();
            this.startTime = data[i]["timestamp"].split('T')[0] + " " + time.toString().split(':')[0] + ":" + time.toString().split(':')[1];
          }
          if (data[i]["event"] == "USER_ATTENDANCE_EVENT") {
            let time = data[i]["timestamp"].split('T')[1].toString();
            this.endTime = data[i]["timestamp"].split('T')[0] + " " + time.toString().split(':')[0] + ":" + time.toString().split(':')[1];
          }
          if (this.endTime == "") {
            let dat1=new Date(this.startTime);
            let dat2 = new Date();
            let totalmin=this.commonService.timeDifferenceMin(dat2, dat1);
            this.staffDetail.time =this.commonService.getHrsFull(totalmin);
          }
          else
          { 
            let dat1=new Date(this.startTime);
            let dat2 = new Date(this.endTime);
            let totalmin=this.commonService.timeDifferenceMin(dat2, dat1);
            this.staffDetail.time =this.commonService.getHrsFull(totalmin);
          }

          markerURL = this.getEventMarker(data[i]["event"]);
          let latLong: string = this.getDefaultCoordinates(i);
          let routeDateList = latLong.substring(1, latLong.length - 1).split(')~(');
          if (routeDateList.length > 0) {
            for (let j = 0; j < routeDateList.length; j++) {
              lat = routeDateList[j].split(',')[0];
              lng = routeDateList[j].split(',')[1];
              if (j == 0) {
                this.setMarker(lat, lng, markerURL, contentString, "event");
              }
              lineData.push({ lat: parseFloat(lat), lng: parseFloat(lng) });
              this.lineDataList.push({ lat: parseFloat(lat), lng: parseFloat(lng) });
            }
            let line = new google.maps.Polyline({
              path: lineData,
              strokeColor: "green",
              strokeWeight: 2
            });
            this.polylines[i] = line;
            this.polylines[i].setMap(this.map);
          }
        }
        this.getDistance();
      }
    }, (error) => {
      this.commonService.setAlertMessage("error", "No record found !!!");
    });
  }

  getDistance() {
    let totalDistance = 0;
    if (this.lineDataList.length > 0) {
      for (let i = 1; i < this.lineDataList.length; i++) {
        let lat1 = this.lineDataList[i - 1]["lat"];
        let lat2 = this.lineDataList[i]["lat"];
        let lng1 = this.lineDataList[i - 1]["lng"];
        let lng2 = this.lineDataList[i]["lng"];
        totalDistance += Number(this.commonService.getDistanceFromLatLonInKm(lat1, lng1, lat2, lng2));
      }
      this.staffDetail.distance = (totalDistance / 1000).toFixed(3);
    }
  }


  setMarker(lat: any, lng: any, markerURL: any, contentString: any, type: any) {
    let scaledHeight = 25;
    let scaledWidth = 31;

    let marker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      map: this.map,
      icon: {
        url: markerURL,
        fillOpacity: 1,
        strokeWeight: 0,
        scaledSize: new google.maps.Size(scaledHeight, scaledWidth),
        origin: new google.maps.Point(0, 0),
        labelOrigin: new google.maps.Point(25, 31)
      }
    });

    let infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    marker.addListener('click', function () {
      infowindow.open(this.map, marker);
    });

    let centerPoint = new google.maps.LatLng(lat, lng);
    this.map.setZoom(18);
    this.map.setCenter(centerPoint);
    this.allMarkers.push({ marker });
  }

  clearMap() {
    this.vehicleMarker = null;
    if (this.allMarkers != null) {
      if (this.allMarkers.length > 0) {
        for (let i = 0; i < this.allMarkers.length; i++) {
          this.allMarkers[i]["marker"].setMap(null);
        }
      }
      this.allMarkers = [];
    }
    if (this.polylines != null) {
      if (this.polylines.length > 0) {
        for (let i = 0; i < this.polylines.length; i++) {
          this.polylines[i].setMap(null);
        }
      }
      this.polylines = [];
    }
  }

  getEventMarker(event: any) {
    if (event == "bike") {
      return "../assets/img/bike2.png";
    }
    else if (event == "APP_LOGIN_EVENT") {
      return "../assets/img/sign-in-1.png";
    }
    else if (event == "USER_ATTENDANCE_EVENT") {
      return "../assets/img/attendance-2.png";
    }
  }

  getDefaultCoordinates(line: any) {
    if (line == 0) {
      return "(26.8870932,75.7379567)~(26.8878491,75.7374417)~(26.8884807,75.7369589)~(26.8886386,75.7368784)~(26.8890404,75.7376187)~(26.8893227,75.7381444)~(26.8895907,75.7386701)~(26.8898873,75.7393192)~(26.8902031,75.739963)~(26.890581,75.7407569)~(26.8909638,75.7414435)~(26.8914087,75.7423233)~(26.8916671,75.7428597)~(26.8920833,75.7438039)~(26.8925043,75.7446568)~(26.8930832,75.7458155)~(26.8936047,75.746808)~(26.8941118,75.7478272)~(26.8946429,75.7488357)~(26.89504,75.7496082)~(26.8953844,75.7502626)~(26.8957432,75.7509332)";
    }
    else {
      return "(26.89575,75.7509155)~(26.8954342,75.7510872)~(26.8948553,75.7511194)~(26.8945683,75.7511301)~(26.8937837,75.7511516)~(26.8933196,75.7511784)~(26.8924345,75.7512267)~(26.8917216,75.7512589)~(26.8911236,75.7513018)~(26.8905734,75.7513393)~(26.8898462,75.7513447)~(26.8890998,75.7512857)~(26.8884922,75.7512589)~(26.8882338,75.7504917)~(26.8879946,75.7497944)~(26.8876357,75.7488717)~(26.8873726,75.7481958)~(26.8870999,75.7474126)";
    }
  }


  getPlayStop() {
    if (this.isStart == false) {
      let options = {
        // max zoom
        zoom: 16,
      };
      this.map.setOptions(options);
      this.isStart = true;
      $('#playStop').removeClass("fab fa-youtube");
      $('#playStop').addClass("fas fa-stop-circle");
      this.setSpeed(Number($('#ddlSpeed').val()));
      this.animate();
    }
    else {
      $('#playStop').removeClass("fas fa-stop-circle");
      $('#playStop').addClass("fab fa-youtube");
      this.isStart = false;
      this.vehicleMarker.setPosition(this.lineDataList[this.lineIndex]);
      this.map.setCenter(this.lineDataList[this.lineIndex]);
    }
  }


  animate() {
    if (this.vehicleMarker == null) {
      this.createMarker();
    }
    this.vehicleMarker.setPosition(this.lineDataList[this.lineIndex]);
    this.map.setCenter(this.lineDataList[this.lineIndex]);
    if (this.isStart == true) {
      if (this.lineIndex < this.lineDataList.length) {
        setTimeout(() => {
          this.lineIndex = this.lineIndex + 1;
          this.animate();
        }, 180);
      }
      else {
        this.vehicleMarker.setPosition(this.lineDataList[this.lineIndex - 1]);
        this.map.setCenter(this.lineDataList[this.lineIndex - 1]);
        this.isStart = false;
        $('#playStop').removeClass("fas fa-stop-circle");
        $('#playStop').addClass("fab fa-youtube");
      }
    }
  }

  createMarker() {
    let lat = this.lineDataList[this.lineIndex]["lat"];
    let lng = this.lineDataList[this.lineIndex]["lng"]
    let markerURL = this.getEventMarker("bike");
    this.vehicleMarker = new google.maps.Marker({
      position: { lat: Number(lat), lng: Number(lng) },
      map: this.map,
      icon: {
        url: markerURL,
        fillOpacity: 1,
        strokeWeight: 0,
        origin: new google.maps.Point(0, 0),
        labelOrigin: new google.maps.Point(25, 31)
      }
    });
  }

  getReset() {
    this.lineIndex = 0;
    this.vehicleMarker.setPosition(this.lineDataList[0]);
    this.map.setCenter(this.lineDataList[0]);
    this.isStart = false;
    $('#playStop').removeClass("fas fa-stop-circle");
    $('#playStop').addClass("fab fa-youtube");
  }

  setSpeed(speed: any) {
    if (speed == 1) {
      this.speed = 20;
      this.skip = 1;
    }
    else if (speed == 2) {
      this.speed = 15;
      this.skip = 1;
    }
    else if (speed == 3) {
      this.speed = 10;
      this.skip = 2;
    }
    else if (speed == 4) {
      this.speed = 20;
      this.skip = 5;
    }
    else if (speed == 5) {
      this.speed = 15;
      this.skip = 4;
    }
    else if (speed == 10) {
      this.speed = 15;
      this.skip = 10;
    }
  }
}

export class staffDetails {
  name: string;
  mobile: string;
  email: string;
  address: string;
  distance: string;
  time: string;
}
