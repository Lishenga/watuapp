import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App, Platform, Nav } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LandingPage } from '../landing/landing';
import { ForgotPage } from '../forgot/forgot';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { HeaderColor } from '@ionic-native/header-color';

/**
 * Generated class for the FirstLoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-first-login',

  templateUrl: 'first-login.html',

})

export class FirstLoginPage {

  @ViewChild('input') myInput;
  
  loger = {password:''}

  status : any 

  one: any

  phone: any

  email: any

  constructor(public navCtrl: NavController, private headerColor: HeaderColor, private statusBar: StatusBar,private storage: Storage,public loadingCtrl: LoadingController, public navParams: NavParams,private http: HttpClient,private toastCtrl: ToastController, private app: App,) {

    this.email = this.navParams.get('email');

  }
   
  ionViewDidLoad() {

    console.log('ionViewDidLoad FirstLoginPage');
    
  }
  

  dologin(){

    if(this.loger.password == '' ){

      return this.presentToast('Kindly Input your password')

    }else{

      this.presentLoadingText()

    }
      
  }

  forgoter() {

    // go to the MyPage component

    this.navCtrl.push(ForgotPage);

  }
  

  

  presentToast(message) {

    let toast = this.toastCtrl.create({

      message: message,

      duration: 3000,

      position: 'bottom',

      showCloseButton: true,

      closeButtonText: 'Got it!',

      dismissOnPageChange: true,

    });
  
    toast.onDidDismiss(() => {

      console.log('Dismissed toast');

    });
  
    toast.present();

  }

  
  
  presentLoadingText() {

    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      const bodys={
        
        email:this.email,
    
        password:this.loger.password
    
      }

      if(this.email == undefined || this.email == null){

        this.presentLoadingText()
      }
          
      this.http.post('http://142.93.7.234:84/api/AuthenticateUser/', bodys)
  
        .subscribe(res => {
  
          this.storage.set('_token',res);

          this.storage.get('oneSignal').then((val) =>{
            
            this.one = val
      
          })
  
          this.storage.get('_token').then((val) => {

              this.status = val.status_code
              
              this.phone = val.data.msisdn
            
          });
          
          console.log(this.status)

          this.storage.set('password',this.loger.password)

          if(this.status == null || this.status == undefined){

            this.presentLoadingText()

          }
      
            if (this.status == 500){
              
              this.presentToast('Kindly Provide the Right Credentails');
    
            }else if (this.status == 200){

              const chat = {
          
                msisdn: this.phone,
          
                player_id: this.one
          
              }
          
              this.http.post('http://142.93.7.234:84/api/ChatSetPlayerDetails/',chat)
              
                .subscribe(ress => {
            
                  console.log({'success':ress});

                this.app.getRootNav().setRoot(LandingPage);
                  
                }, (err) => {
            
                console.log({'error':err});
            
                })
    
            }
          
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

