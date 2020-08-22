import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore/firestore.service'
@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  constructor(private router: Router, private firestoreService: FirestoreService) { }
  dbUsuarios: any = {
    id: "",
    data: {}
  };
  estadoLen = "Bueno";
  UUID;
  nomLista;
  async ngOnInit() {
    // obtener nombres
    let url = this.router.url.replace('/lista/', '');
    this.UUID = url.split('/', 1);
    this.nomLista = url.split('/').pop().split('/')[0].replace(/%20/g, ' ');
    //cargar datos
    await this.firestoreService.consultarPorId("usuarios", this.UUID+";"+this.nomLista).subscribe((resultado) => {
      this.dbUsuarios.data = resultado.payload.data();
    });

    // mostrar mensaje primera vez:
    if (this.dbUsuarios.data.estado) {
      this.hiddenElement("estadoLentillas");
    } else {
      this.hiddenElement("mensajeNoLentillas");
    }

    switch (this.estadoLen){
      case "Bueno":
        document.getElementById("colorEstado").setAttribute("style", "color: green");
        break;
      case "Usadas":
        document.getElementById("colorEstado").setAttribute("style", "color: primary");
        break;
      case "Malo":
        document.getElementById("colorEstado").setAttribute("style", "color: red");
        break;
    }
    
  }

  hiddenElement(nombre) {
    // mostrar datos
    document.getElementById(nombre).setAttribute("style", "visibility: visible; display: block");
    // ocultar barra de carga
    document.getElementById('progressBa').setAttribute("style", "visibility: hidden");
  }

  async comenzarLent() {
    let date = new Date();

    let datos = {dia: date.getDate(), mes: date.getMonth(), year: date.getFullYear()}
    await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, datos);
  }
}
