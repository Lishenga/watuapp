import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, AlertController, App  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { MenuController } from 'ionic-angular';
import { CacheService } from "ionic-cache";
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-settings',

  templateUrl: 'settings.html',

})

export class SettingsPage {

  @ViewChild('input') myInput;

  setting = {

    currency:'',

  }

  constructor(public navCtrl: NavController, private app: App, public actionSheetCtrl: ActionSheetController,  public menuCtrl: MenuController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private cache: CacheService, public navParams: NavParams, private storage: Storage,) {

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad SettingsPage');

  }

  ionViewWillEnter() {

    this.menuCtrl.close();

  }

  ionViewDidLeave() {

    this.menuCtrl.swipeEnable( true )

  }


  clear(){

    this.presentLoadingCacheText();

  }

  set(){

    this.storage.set('currency', this.setting.currency)

    this.presentLoadingText()

    this.setting.currency = '';

  }

  showAlert() {

      let alert = this.alertCtrl.create({
        
        title: 'Success!',
  
        subTitle: "Currency Successfully Set",
  
        buttons: ['OK']
  
      });
  
      alert.present();

  }

  CacheAlert() {

    let alert = this.alertCtrl.create({
      
      title: 'Success!',

      subTitle: "Cache Cleared",

      buttons: ['OK']

    });

    alert.present();

}

  public presentActionSheet() { 
    
    let actionSheet = this.actionSheetCtrl.create({

      title: 'Warning! You will be logged Out',

      buttons: [

        {

          text: 'Clear Cache',

          handler: () => {

            this.presentLoadingCacheText()

          }

        },

        {

          text: 'Cancel',

          role: 'cancel'

        }

      ]

    });

    actionSheet.present();

  }
    

  presentLoadingText() {

    console.log('ining')
    
    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      this.showAlert();


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }


  presentLoadingCacheText() {

    console.log('ining')
    
    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      this.CacheAlert();

    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
