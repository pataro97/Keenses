import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { Device } from '@ionic-native/device/ngx';
import {IonSlides} from '@ionic/angular';


@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  constructor(private router: Router, private devices: Device) { }
  
  text: string = "Skip";

  ngOnInit() {
    if(localStorage['firstTimeLoad']!='TRUE'){
      // primera vez que entra app
      localStorage['firstTimeLoad']='TRUE';
      // this.router.navigate(["/welcome"]);
    }
    else{
      // ha entrado alguna vez(no logeado)
      this.goLogin();
    }
  }
  goLogin() {
    this.router.navigate(["/home/"+this.devices.uuid]);
  }

  slideChanged() {
    if (this.slides.isEnd()) {
      this.text = "Alright, I got it";
    }
  }
}