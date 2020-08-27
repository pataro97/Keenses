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

            // mod estado liq
        if(this.dbUsuarios.data.diasCad <= 0) {
          this.dbUsuarios.data.estado = "Malo";
          this.estadoLen = "Malo";
          this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
        } else {
          
          if(this.dbUsuarios.data.estado){
            this.dbUsuarios.data.estado = "Bueno";
          }
          this.estadoLen = "Bueno";
          this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
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
    // parte liquido
        // mensaje liquido en [menu] lentillas
        if (this.dbUsuarios.data.fechIniC) {
          document.getElementById("mostrarDias").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("menuLiq").setAttribute("style", "visibility: visible; display: block");

          // ------------------ Calcular dias
          var date = new Date(this.dbUsuarios.data.fechIniM+"/"+this.dbUsuarios.data.fechIniD+"/"+this.dbUsuarios.data.fechIniY);
          let modDate = this.addDays(date, this.dbUsuarios.data.diasCadO);

          var dd = modDate.getDate();
          var mm = modDate.getMonth() + 1;
          var y = modDate.getFullYear();

          this.fechaFinal = dd+'/'+mm+'/'+y;



          // --------------------------- restar dias
          let dateNow = new Date();
          let dia =  dateNow.getDate();
          let mes = dateNow.getMonth()+1;
          let año = dateNow.getFullYear();
          let fechaCompletaActual = dia+'/'+mes+'/'+año;
                    
          
          if(this.restaFechas(fechaCompletaActual, this.fechaFinal) != this.dbUsuarios.data.diasCad) {
            
            this.dbUsuarios.data.diasCad = this.restaFechas(fechaCompletaActual, this.fechaFinal);
            this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
          }


        } else {
          document.getElementById("mostrarError").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("menuIniLiq").setAttribute("style", "visibility: visible; display: block");
          document.getElementById("botCad").setAttribute("style", "visibility: hidden; display: none");
        }
  }

  restaFechas = function(f1,f2) {
    var aFecha1 = f1.split('/');
    var aFecha2 = f2.split('/');
    var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
    var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
    var dif = fFecha2 - fFecha1;
    var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
    return dias;
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

    let datos;
    if(this.dbUsuarios.data.fechIniD == null ) {
      datos = {dia: date.getDate(), mes: date.getMonth()+1, year: date.getFullYear(), estado: "Bueno", diasUso: 0}
    } else {
      datos = {dia: date.getDate(), mes: date.getMonth()+1, year: date.getFullYear(), estado: "Bueno", diasUso: 0, fechIniC: this.dbUsuarios.data.fechIniC,
      fechIniD: this.dbUsuarios.data.fechIniD,
      fechIniM: this.dbUsuarios.data.fechIniM,
      fechIniY: this.dbUsuarios.data.fechIniY,
      diasCadO: this.dbUsuarios.data.diasCadO,
      diasCad: this.dbUsuarios.data.diasCad
    }
  

    }

    await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, datos);
    // ocultar mensaje
    document.getElementById('mensajeNoLentillas').setAttribute("style", "visibility: hidden; display: none");
    document.getElementById('progressBa').setAttribute("style", "visibility: visible");
    this.ngOnInit();
  }

  async sum() {
    this.dbUsuarios.data.diasUso++;
    // mod estado liq
    if(this.dbUsuarios.data.diasCad <= 0) {
      this.dbUsuarios.data.estado = "Malo";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    }else {
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
    // mod estado liq
    if(this.dbUsuarios.data.diasCad <= 0) {
      this.dbUsuarios.data.estado = "Malo";
      await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    }else {
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
    this.dbUsuarios.data.diasCadO = cad;
    this.dbUsuarios.data.diasCad = cad;
    await this.firestoreService.actualizar('usuarios', this.UUID+";"+this.nomLista, this.dbUsuarios.data)
    document.getElementById("menuIniLiq").setAttribute("style", "visibility: hidden; display: none");
    document.getElementById("mostrarError").setAttribute("style", "visibility: hidden; display: none");
    this.dataManagement();
  }

  newLiq() {
    document.getElementById("menuLiq").setAttribute("style", "visibility: hidden; display: none");
    document.getElementById("menuIniLiq").setAttribute("style", "visibility: visible; display: block");
  }
}
