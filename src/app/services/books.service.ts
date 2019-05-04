import { Injectable } from '@angular/core';
import { Book } from '../models/Books.model';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[];
  booksSubject = new Subject<Book[]>();

  constructor() { }

  emitBooks() {
    this.booksSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books').on('value', (data) => {
      this.books = data.val() ? data.val() : [];
      this.emitBooks();
    });
  }

  getSingleBook(id: number) {
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/books/' + id).once('value')
        .then(
          (data) => {
            console.log(data.val());
            resolve(data.val());
          }
        , (error) => {
            reject(error);
          }
        )
      }
    );
  }

  createNewBook(book: Book) {
    if (!this.books) {this.books = [];}
    this.books.push(book);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    if (book.photo) {
      const storageRef = firebase.storage().refFromURL(book.photo);
      storageRef.delete().then(
        () => {
          console.log('Photo supprimée');
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé ' + error);
        }
      );
    }
    const bookIndexToRemove = this.books.findIndex(
      (bookEl) => {
        if (book === bookEl) {
          return true;
        }
    });
    this.books.splice(bookIndexToRemove, 1);
    this.saveBooks();
    this.emitBooks();
  }

  uploadFile(file: File) {
    return new Promise(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref().child('images/' + almostUniqueFileName + file.name).put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED, 
          () => {
            console.log('Chargement ...');
          },
          (error) => {
            console.log('Erreur de chargement ' + error);
            reject();
          },
          () => {
            const pathUrl = firebase.storage().ref('images/' + almostUniqueFileName + file.name);
            resolve(pathUrl.getDownloadURL());
          }
        )
      }
    )
  }
}
