import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { FirestoreService } from '../services/firestore/firestore.service';
import { __values } from 'tslib';

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

  constructor(private router: Router, private firestoreService: FirestoreService) {  }

  ngOnInit() {

    let UUID = this.router.url.replace('/home/', '');

    this.firestoreService.consultarPorId("usuarios", UUID).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.dbUsuarios.id = resultado.payload.id;
        this.dbUsuarios.data = resultado.payload.data();
        this.hiddenPrBar();
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        alert("no se ha encontrado");
        this.hiddenPrBar();
      }
    });
    
  }

  hiddenPrBar() {
    // ocultar barra de carga
    document.getElementById('progressBI').setAttribute("style", "visibility: hidden");
  }

}
