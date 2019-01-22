import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the TransactionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-transactions',

  templateUrl: 'transactions.html',

})

export class TransactionsPage {

  transact: any

  value = []

  currency: any

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private storage: Storage,) {

      this.transact = this.navParams.get('transact')
      
      for(let item of this.transact.data){
  
        this.value.push(item)
      }

      this.storage.get('currency').then((val) =>{

        if(val == null || val == undefined){

          this.currency = 'USD'

        }else{

          this.currency = val
          
        }

      })

  }

  statement(){

    let alert = this.alertCtrl.create({

      title: 'Statement',

      subTitle: 'Email Statement Sent', 

      buttons: ['Dismiss']

    });

    alert.present();

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad TransactionsPage');
    
  }
  

}
