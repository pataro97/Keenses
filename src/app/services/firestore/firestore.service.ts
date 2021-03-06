import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private AngularFireStorage:AngularFireStorage) { }

  public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos);
  }

  public consultar(coleccion) {
    return this.angularFirestore.collection(coleccion).snapshotChanges();
  }

  public borrar(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).delete();
  }

  public deleteFileFromURL(fileURL) {
    return this.AngularFireStorage.storage.refFromURL(fileURL).delete();
  }
 
  public actualizar(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set(datos);
  }
  
  public consultarPorId(coleccion, documentId) {
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

  public uploadImage(nombreCarpeta, nombreArchivo, imagenBase64){
    let storageRef = this.AngularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString("data:image/jpeg;base64,"+imagenBase64, 'data_url');
  }

  // Registro con datos personalizado usuarios>>uid>>datos
  public registro (nomColl, uid) {
    return this.angularFirestore.collection(nomColl).doc(uid).set({
      //campos creados base datos
      uid: uid,
      listas: []
    })
  }


  // actualizar mod
  public actualizarMod(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).set({
      uid: documentId,
      listas: datos
    });
  }
  

  // actualizar mod
  public añadirLista(coleccion, documentId, datos) {
    return this.angularFirestore.collection(coleccion).doc(documentId).update(datos)
  }
  

    // Crear listas
    public crearLista(nomColl, uid, nombreList) {
      return this.angularFirestore.collection(nomColl).doc(uid+";"+nombreList).set({
        //campos creados base datos
        nombre: nombreList
      })
    }

}
