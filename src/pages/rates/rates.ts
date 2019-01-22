import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the RatesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({
  selector: 'page-rates',

  templateUrl: 'rates.html',

})

export class RatesPage {

  value = []

  rater : any

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public loadingCtrl: LoadingController,) {

    this.rater = this.navParams.get('rating')
      
    for(let item of this.rater.data){

      this.value.push(item)

    }

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad RatesPage');

  }

  refresh(){

    let loading = this.loadingCtrl.create({
        
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {
      
      this.http.get('http://142.93.7.234:84/api/settings/ViewAllRates')
  
      .subscribe(ress => {
  
        console.log({'success':ress});
  
        this.rater = ress
      
        for(let item of this.rater.data){

          this.value.push(item)

        }
        
      }, (err) => {
  
      console.log({'error':err});
  
        });


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

  
}
