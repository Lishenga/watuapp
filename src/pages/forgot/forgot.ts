import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';

/**
 * Generated class for the ForgotPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-forgot',

  templateUrl: 'forgot.html',

})

export class ForgotPage {

  @ViewChild('input') myInput;

  forgot = {email:''}

  constructor(public navCtrl: NavController, public navParams: NavParams,public loadingCtrl: LoadingController,private http: HttpClient,private toastCtrl: ToastController,) {
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ForgotPage');

  }

  forgotten(){

    this.presentLoadingText()

  }

  presentToast(message) {

    let toast = this.toastCtrl.create({

      message: message,

      duration: 3000,

      position: 'bottom'

    });
  
    toast.onDidDismiss(() => {

      console.log('Dismissed toast');

    });
  
    toast.present();

  }
  
  presentLoadingText() {

    console.log('ining')

    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      const bodys={
        
        email:this.forgot.email.toLowerCase(),
            
      }
          
      this.http.post('http://142.93.7.234:84/api/AuthenticateUser/', bodys)

        .subscribe(res => {

          console.log({'success':res});

          this.presentToast('Kindly Check Your Email');
          
          this.navCtrl.push(LoginPage);
          
          
      }, (err) => {

        console.log({'error':err});

        this.presentToast('Kindly Provide the Right Credentails');

      });


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
