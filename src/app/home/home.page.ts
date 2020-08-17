import { Component } from '@angular/core';
import { Device } from '@ionic-native/device/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private device: Device) {}

  async ngOnInit() {
    document.getElementById('getMac').innerHTML = await this.device.uuid;
  }
}
