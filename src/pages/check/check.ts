import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the CheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  
  selector: 'page-check',

  templateUrl: 'check.html',

})

export class CheckPage {

  value = []

  stripe: any

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,) {

    this.stripe = this.navParams.get('allcards');
    
    for(let item of this.stripe.data.data){

      this.value.push(item)
    }

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad CheckPage');

  }

}
