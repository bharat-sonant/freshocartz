import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { data } from 'jquery';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router, private toastr: ToastrService) { }

  notificationInterval: any;


  getAllZones() {
    return JSON.parse(localStorage.getItem('zones'));
  }

  setTodayDate() {
    let d = new Date();

    let month = d.getMonth() + 1;
    let day = d.getDate();

    return d.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
  }

  getDate(day: any, month: any, year: any) {
    return year + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day;
  }

  getTodayDateTime() {
    let d = new Date();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let min = d.getMinutes();


    return d.getFullYear() + '-' +
      (month < 10 ? '0' : '') + month + '-' +
      (day < 10 ? '0' : '') + day + ' ' +
      (hour < 10 ? '0' : '') + hour + ':' +
      (min < 10 ? '0' : '') + min;
  }

  getDaysBetweenDates(date1: any, date2: any) {
    let Difference_In_Time = new Date(date2.toString()).getTime() - new Date(date1.toString()).getTime();
    return Difference_In_Time / (1000 * 3600 * 24);
  }

  getNextDate(currentDate: any, addDay: any) {
    let date = new Date(currentDate.toString());
    date.setDate(date.getDate() + addDay);
    let month = (date.getMonth() + 1).toFixed(0);
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    let day = date.getDate();
    let nextday = day.toString();
    let year = date.getFullYear();
    if (day.toString().length == 1) {
      nextday = "0" + day;
    }
    return year + "-" + month + "-" + nextday;
  }


  getPreviousDate(currentDate: any, addDay: any) {
    let date = new Date(currentDate.toString());
    date.setDate(date.getDate() - addDay);
    let month = (date.getMonth() + 1).toFixed(0);
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    let day = date.getDate();
    let nextday = day.toString();
    let year = date.getFullYear();
    if (day.toString().length == 1) {
      nextday = "0" + day;
    }
    return year + "-" + month + "-" + nextday;
  }

  getPreviousMonth(currentDate: any, addMonth: any) {
    let date = new Date(currentDate.toString());
    date.setMonth(date.getMonth() - addMonth);
    let month = (date.getMonth() + 1).toFixed(0);
    if (month.toString().length == 1) {
      month = "0" + month;
    }
    let day = date.getDate();
    let nextday = day.toString();
    let year = date.getFullYear();
    if (day.toString().length == 1) {
      nextday = "0" + day;
    }
    return year + "-" + month + "-" + nextday;
  }

  initMapProperties(zoomControl:any,scrollwheel:any) {
    var mapProp = {
      // center: new google.maps.LatLng(28.4041, 77.07301009999999),
      center: new google.maps.LatLng(26.8870932, 75.7379567),
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: zoomControl,
      backgroundColor: 'none',
      mapTypeControl: true,
      fullscreenControl: false,
      streetViewControl: false,       
      scaleControl: false,
      scrollwheel: scrollwheel,     
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // styles: [	  
      //   { "elementType": "labels.icon", "stylers": [ { "visibility": "on" } ] },
      //   { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" },{ "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill",  "stylers": [ { "color": "#4e4e4e" },{ "visibility": "on" } ] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [ { "visibility": "off" },{"weight" : "5"} ] },
      // ] 
    };

    return mapProp;
  }


  initMapPropertiesDefault() {


    var mapProp = {
      center: new google.maps.LatLng(27.6094, 75.1077),
      //center: new google.maps.LatLng(27.609602241246694, 75.07276436205115),
      zoom: 12,
      disableDefaultUI: false,
      zoomControl: false,
      backgroundColor: 'none',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // styles: [	  
      //   { "elementType": "labels.icon", "stylers": [ { "visibility": "on" } ] },
      //   { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" },{ "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill",  "stylers": [ { "color": "#4e4e4e" },{ "visibility": "on" } ] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [ { "visibility": "off" },{"weight" : "5"} ] },
      // ] 
    };

    return mapProp;
  }



  initMapPropertiesRealTime() {


    var mapProp = {
      center: new google.maps.LatLng(27.6094, 75.1077),
      //center: new google.maps.LatLng(27.609602241246694, 75.07276436205115),
      zoom: 50,
      disableDefaultUI: false,
      zoomControl: false,
      backgroundColor: 'none',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // styles: [	  
      //   { "elementType": "labels.icon", "stylers": [ { "visibility": "on" } ] },
      //   { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" },{ "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill",  "stylers": [ { "color": "#4e4e4e" },{ "visibility": "on" } ] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [ { "visibility": "off" },{"weight" : "5"} ] },
      // ] 
    };

    return mapProp;
  }

  initPropertiesForEditCardMap(lat: any, lng: any) {


    var mapProp = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 19,
      disableDefaultUI: false,
      zoomControl: true,
      backgroundColor: 'none',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // styles: [
      //   { "elementType": "labels.icon", "stylers": [{ "visibility": "on" }] },
      //   { "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }, { "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#4e4e4e" }, { "visibility": "on" }] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [{ "visibility": "off" }, { "weight": "5" }] },
      // ]
    };

    return mapProp;
  }

  mapForReport() {

    var mapProp = {
      center: new google.maps.LatLng(27.6094, 75.1077),
      optimized: false,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: false,
      backgroundColor: 'none',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      draggable: false,
      scaleControl: false,
      scrollwheel: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      // styles: [	  
      //   { "elementType": "labels.icon", "stylers": [ { "visibility": "on" } ] },
      //   { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" },{ "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill",  "stylers": [ { "color": "#4e4e4e" },{ "visibility": "on" } ] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [ { "visibility": "off" },{"weight" : "5"} ] },
      // ] 
    };

    return mapProp;
  }

  mapForHaltReport() {

    var myStyles = [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ];



    var mapProp = {
      center: new google.maps.LatLng(27.6094, 75.1077),
      zoom: 14,
      disableDefaultUI: false,
      zoomControl: true,
      backgroundColor: 'none',
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP,

      //mapTypeIds: ['roadmap', 'styled_map'],
      //styledMapType: mapstyle,
      //styles: myStyles 
      // styles: [	  
      //   { "elementType": "labels.icon", "stylers": [ { "visibility": "on" } ] },
      //   { "elementType": "labels.text.fill", "stylers": [ { "color": "#757575" },{ "visibility": "on" }] },
      //   { "featureType": "road.local", "elementType": "labels.text.fill",  "stylers": [ { "color": "#4e4e4e" },{ "visibility": "on" } ] },
      //   { "featureType": "administrative", "elementType": "labels", "stylers": [ { "visibility": "off" },{"weight" : "5"} ] },
      // ] 
    };

    return mapProp;
  }



  getHrs(minutes: any) {

    let totalHrs = (minutes / 60).toString().split('.');

    let hrs = totalHrs[0];
    let mins: any;

    if (totalHrs.length > 1) {
      let min = Math.round((Number('.' + totalHrs[1])) * 60);
      mins = min.toString().length == 1 ? "0" + min : min;
    } else {
      mins = "00";
    }
    return hrs + ":" + mins// Number(mins).toFixed(2);

  }
  getHrsFull(minutes: any) {

    let totalHrs = (minutes / 60).toString().split('.');

    let hrs = totalHrs[0];
    let mins: any;

    if (totalHrs.length > 1) {
      let min = Math.round((Number('.' + totalHrs[1])) * 60);
      mins = min.toString().length == 1 ? "0" + min : min;
    } else {
      mins = "00";
    }
    return hrs + " hr " + mins + " min";// Number(mins).toFixed(2);

  }

  getCurrentMonthName(monthNumber: number) {
    var d = new Date();
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    if (monthNumber != undefined) {
      return month[monthNumber];
    } else {
      return month[d.getMonth()];
    }
  }

  getCurrentMonthShortName(monthNumber: number) {
    var d = new Date();
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    if (monthNumber != undefined) {
      return month[monthNumber];
    } else {
      return month[d.getMonth()];
    }
  }

  tConvert(time: any) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
  }



  transform(array: Array<any>, args: string): Array<any> {
    if (typeof args[0] === "undefined") {
      return array;
    }
    if (typeof array === "undefined") {
      return array;
    }
    let direction = args[0][0];
    let column = args.replace('-', '');
    array.sort((a: any, b: any) => {
      let left = Number(new Date(a[column]));
      let right = Number(new Date(b[column]));
      return (direction === "-") ? right - left : left - right;
    });
    return array;
  }

  transformString(array: Array<any>, args: string): Array<any> {
    if (typeof args[0] === "undefined") {
      return array;
    }
    if (typeof array === "undefined") {
      return array;
    }
    var reA = "/[^a-zA-Z]/g";
    var reN = "/[^0-9]/g";
    let direction = args[0][0];
    let column = args;
    array.sort((a: any, b: any) => {

      if (a === b) {
        return 0;
      }
      if (typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    });

    return array;
  }

  transformNumeric(array: Array<any>, args: string): Array<any> {
    if (typeof args[0] === "undefined") {
      return array;
    }
    if (typeof array === "undefined") {
      return array;
    }
    let direction = args[0][0];
    let column = args;
    array.sort((a: any, b: any) => {

      let left = a[column];
      let right = b[column];
      return (left > right) ? 1 : -1;
    });
    return array;
  }

  convert24(time: any) {
    let hours = Number(time.match(/^(\d+)/)[1]);
    let minutes = Number(time.match(/:(\d+)/)[1]);
    let AMPM = time.match(/\s(.*)$/)[1].toLowerCase();

    if (AMPM == "pm" && hours < 12) hours = hours + 12;
    if (AMPM == "am" && hours == 12) hours = hours - 12;
    let sHours = hours.toString();
    let sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;

    return sHours + ':' + sMinutes;

  }

  timeDifferenceMin(dt2: Date, dt1: Date) {
    let diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
  }

  getMinuteToHHMM(minutes: any) {
    return (parseFloat(minutes) / 60).toFixed(2).split(".")[0] + " hr " + (parseFloat(((parseFloat(minutes) / 60).toFixed(2).split(".")[1])) * 60).toString().slice(0, 2) + " min";

  }


  getCurrentTime() {
    return new Date().toTimeString().split(' ')[0].split(':')[0] + ":" + new Date().toTimeString().split(' ')[0].split(':')[1];
  }

  gteHrsAndMinutesOnly(time: string) {
    let hrsAndMinutes = "";
    if (time != "") {
      hrsAndMinutes = time.split(' ')[1].toString().substring(0, 5);
    }

    return hrsAndMinutes;
  }



  setAlertMessage(type: any, message: any) {
    if (type == "error") {
      this.toastr.error(message, '', {
        timeOut: 6000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-danger alert-with-icon",
        positionClass: 'toast-bottom-right'
      });
    }
    else {
      this.toastr.error(message, '', {
        timeOut: 6000,
        enableHtml: true,
        closeButton: true,
        toastClass: "alert alert-info alert-with-icon",
        positionClass: 'toast-bottom-right'
      });
    }
  }

  setAlertMessageWithCss(type: any, message: any, cssClass: any) {
    if (type == "error") {
      this.toastr.error(message, '', {
        timeOut: 6000,
        enableHtml: true,
        closeButton: true,
        toastClass: cssClass,
        positionClass: 'toast-bottom-right'
      });
    }
    else {
      this.toastr.error(message, '', {
        timeOut: 6000,
        enableHtml: true,
        closeButton: true,
        toastClass: cssClass,
        positionClass: 'toast-bottom-right'
      });
    }
  }

  replaceAll(value: any, replaceFrom: any, replaceTo: any) {
    let returnValue = "";
    let valueList = value.split(replaceFrom);
    for (let i = 0; i < valueList.length; i++) {
      returnValue = returnValue + valueList[i] + replaceTo
    }
    return returnValue;
  }

  checkDate() {
    if (localStorage.getItem('loginDate') == null) {
      this.router.navigate(['/logout']);
      $("#divSideMenus").hide();
      return;
    }
    else if (localStorage.getItem('loginDate') != this.setTodayDate()) {
      this.router.navigate(['/logout']);
      $("#divSideMenus").hide();
      return;
    }
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6377830; // metres
    const φ1 = lat1 * Math.PI / 180; // φ, λ in radians
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) *
      Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // in metres
  }

  deg2rad(deg: any) {
    return deg * (Math.PI / 180)
  }
}
