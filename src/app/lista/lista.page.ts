import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from '../services/firestore/firestore.service';
@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
})
export class ListaPage implements OnInit {

  constructor(private router: Router, private firestoreService: FirestoreService) {  }
  dbUsuarios: any = {
    data: {}
  };
  estadoLen = "Bueno";
  estadoLiq = "Bueno";
  UUID;
  nomLista;
  fechaFinal;
  async ngOnInit() {
    // obtener nombres
    let url = this.router.url.replace('/lista/', '');
    this.UUID = url.split('/', 1);
    this.nomLista = url.split('/').pop().split('/')[0].replace(/%20/g, ' ');
    //cargar datos
    await this.firestoreService.consultarPorId("usuarios", this.UUID+";"+this.nomLista).subscribe((resultado) => {
      this.dbUsuarios.data = resultado.payload.data();
    });
    // tiempo de espera para poder cargar datos
    setTimeout(() => {
      this.dataManagement()
     }, 1500);
    
  }

  dataManagement() {
    // parte lentillas
        // mostrar mensaje primera vez:
        if (this.dbUsuarios.data.estado) {
          this.hiddenElement("estadoLentillas");
        } else {
          this.hiddenElement("mensajeNoLentillas");
        }

        this.estadoLen = this.dbUsuarios.data.estado

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
    // parte liquido
        // mensaje liquido en [menu] lentillas
        if (this.dbUsuarios.data.fechIniC) {
          document.getElementById("mostrarDias").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("menuLiq").setAttribute("style", "visibility: visible; display: block");
         
          // Calcular dias
          var date = new Date(this.dbUsuarios.data.fechIniM+"/"+this.dbUsuarios.data.fechIniD+"/"+this.dbUsuarios.data.fechIniY);
          let modDate = this.addDays(date, this.dbUsuarios.data.diasCad);

          var dd = modDate.getDate();
          var mm = modDate.getMonth() + 1;
          var y = modDate.getFullYear();

          this.fechaFinal = dd+'/'+mm+'/'+y;


        } else {
          document.getElementById("mostrarError").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("menuIniLiq").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("botCad").setAttribute("style", "visibility: hidden; display: none");
        }

  }


  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
}


  hiddenElement(nombre) {
    // mostrar datos
    document.getElementById(nombre).setAttribute("style", "visibility: visible; display: block");
    // ocultar barra de carga
    document.getElementById('progressBa').setAttribute("style", "visibility: hidden");
  }

  async comenzarLent() {
    let date = new Date();
    let datos = {dia: date.getDate(), mes: date.getMonth()+1, year: date.getFullYear(), estado: "Bueno", diasUso: 0}
    await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, datos);
    // ocultar mensaje
    document.getElementById('mensajeNoLentillas').setAttribute("style", "visibility: hidden; display: none");
    document.getElementById('progressBa').setAttribute("style", "visibility: visible");
    this.ngOnInit();
  }

  async sum() {
    this.dbUsuarios.data.diasUso++;
    if(this.dbUsuarios.data.diasUso <= 14) {
      this.dbUsuarios.data.estado = "Bueno";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    } else if(this.dbUsuarios.data.diasUso >=  15 && this.dbUsuarios.data.diasUso <=  29) {
      this.dbUsuarios.data.estado = "Usadas";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    } else if(this.dbUsuarios.data.diasUso >= 30) {
      this.dbUsuarios.data.estado = "Malo";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    }

    // actualizar estado
    this.estadoLen = this.dbUsuarios.data.estado;
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


  async res() {
    this.dbUsuarios.data.diasUso--;
    if(this.dbUsuarios.data.diasUso <= 14) {
      this.dbUsuarios.data.estado = "Bueno";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    } else if(this.dbUsuarios.data.diasUso >=  15 && this.dbUsuarios.data.diasUso <=  29) {
      this.dbUsuarios.data.estado = "Usadas";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    } else if(this.dbUsuarios.data.diasUso >= 30) {
      this.dbUsuarios.data.estado = "Malo";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    }

    // actualizar estado
    this.estadoLen = this.dbUsuarios.data.estado;
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

  changeDate() {
    // mostrar resto de campos
    document.getElementById("botCad").setAttribute("style", "visibility: visible; display: block");

  }

  async comenzarLiq(date, cad) {
    // extraer y separar fecha
    let ArrayDate = date.split("-", 3);
    let año = ArrayDate[0];
    let mes = ArrayDate[1];
    let dia = ArrayDate[2].substring(0, 2);
    // escribir datos
    this.dbUsuarios.data.fechIniC = dia+"/"+mes+"/"+año;
    this.dbUsuarios.data.fechIniD = dia;
    this.dbUsuarios.data.fechIniM = mes;
    this.dbUsuarios.data.fechIniY = año;
    this.dbUsuarios.data.diasCad = cad;
    await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    this.dataManagement();
  }

}
