import { Component } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bookshelves';

  constructor() {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyBpAavfLs_7F8zUrgsxD0FN2EzciVg5Ju0",
      authDomain: "open-classroom-angular.firebaseapp.com",
      databaseURL: "https://open-classroom-angular.firebaseio.com",
      projectId: "open-classroom-angular",
      storageBucket: "open-classroom-angular.appspot.com",
      messagingSenderId: "847247050458"
    };
    firebase.initializeApp(config);
  }
}
