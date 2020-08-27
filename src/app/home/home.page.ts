import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FirestoreService } from '../services/firestore/firestore.service';
import { __values } from 'tslib';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  dbUsuarios: any = {
    id: "",
    data: {}
  };

  constructor(private router: Router, private firestoreService: FirestoreService, private alertController: AlertController) {  }

  ngOnInit() {
    let UUID = this.router.url.replace('/home/', '');

    this.firestoreService.consultarPorId("usuarios", UUID).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.dbUsuarios.id = resultado.payload.id;
        this.dbUsuarios.data = resultado.payload.data();
        if (this.dbUsuarios.data.listas.length <= 0) {
          document.getElementById('container').setAttribute("style", "visibility: visible");
        }
        this.hiddenPrBar();
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        document.getElementById('container').setAttribute("style", "visibility: visible");
        this.escribirUUID(UUID);
        this.hiddenPrBar();
      }
    });
    
  }

  hiddenPrBar() {
    // ocultar barra de carga
    document.getElementById('progressBI').setAttribute("style", "visibility: hidden");
  }

  escribirUUID(UUID) {
    this.firestoreService.registro('usuarios', UUID);
  }
// boton añadir
  async clicNuevo(log) {
    if(log != true) {
      log = false;
      const alert = await this.alertController.create({
        header: 'Nueva lista',
        message: 'Nombre de la lista:',
        inputs: [
          {
            name: 'name1',
            type: 'text'
          }],    
         buttons: [
              {
                text: 'Cancel',
                role: 'cancel',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              }, {
                text: 'Ok',
                handler: (alertData) => {
                  console.log(alertData.name1);
                  let cont = true;
                  if(alertData.name1 != "") {
                    let arrayObtenido = [];
                      for(let i = 0; this.dbUsuarios.data.listas.length > i ; i++) {
                        arrayObtenido.push(this.dbUsuarios.data.listas[i]);
                        if (this.dbUsuarios.data.listas[i] == alertData.name1){
                          console.log("existe el mismo nombre")
                          cont = false;
                          this.clicNuevo(true);
                        }
                      }
                      if(cont) {
                        arrayObtenido.push(alertData.name1);
                        this.añadirNuevaLista(arrayObtenido, alertData.name1);
                        document.getElementById('container').setAttribute("style", "visibility: hidden");
                      }
                  }
                }
                  }
                  
            ]
    });
    await alert.present();
    }else {
      const errorAlert = await this.alertController.create({
        header: 'Error',
        message: 'Existe una lista con el mismo nombre',
        cssClass: 'errorAlert',
         buttons: [
              {
                text: 'ok',
                role: 'ok',
                cssClass: 'secondary',
                handler: () => {
                  console.log('Confirm Cancel');
                }
              }
                  
            ]
    });
    await errorAlert.present();
    }
    
  }
// funcion añadir nueva lista
  async añadirNuevaLista(arryLista, nombreLista) {
    let uuid = this.router.url.replace('/home/', '');
    await this.firestoreService.actualizarMod('usuarios', uuid, arryLista);
    await this.firestoreService.crearLista('usuarios', uuid, nombreLista)
  }

  goLista(nomLista) {
    this.router.navigate(['/lista/'+this.router.url.replace('/home/', '')+'/'+nomLista]);
  }

  borrarLista(listaN) {
    let arrOb = [];
    let uuid = this.router.url.replace('/home/', '');

    this.firestoreService.borrar('usuarios' , uuid+';'+listaN);
    for(let i = 0;this.dbUsuarios.data.listas.length > i; i++){
      if(listaN != this.dbUsuarios.data.listas[i]){
        arrOb.push(this.dbUsuarios.data.listas[i]);
      }
    }
    this.firestoreService.actualizarMod('usuarios', uuid, arrOb)
  }
}
