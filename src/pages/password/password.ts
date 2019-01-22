import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-password',

  templateUrl: 'password.html',

})

export class PasswordPage {

  @ViewChild('input') myInput;

  pass = {password:'',confirm:'',old:''}

  exist: any

  id: Array<{fname: string, lname: string}>

  constructor(public navCtrl: NavController, private app: App, public alertCtrl: AlertController, public navParams: NavParams,private storage: Storage,public loadingCtrl: LoadingController, private http: HttpClient,private toastCtrl: ToastController,) {

    this.storage.get('_token').then((val) => {

      if(val == null || val == undefined){

        return this.app.getRootNav().setRoot(HomePage);

      }else{

        this.id = val.data.id;

      }

    });

    this.storage.get('password').then((val) => {

      this.exist = val
    
    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad PasswordPage');

  }

  change(){

    if(this.exist === this.pass.old){
      
        if(this.pass.password == '' || this.pass.confirm == ''){

          return this.presentToast()
    
        }else{
    
          this.presentLoadingText()
    
        }

    }else{

      return this.presentToaster()

    }
   
  }
  

  showAlert(res) {

    if(res.status_code == 200){

      let alert = this.alertCtrl.create({
        
        title: 'Success!',
  
        subTitle: "Password Successfully Changed",
  
        buttons: ['OK']
  
      });
  
      alert.present();

    }else if(res.status_code == 500){

      let alert = this.alertCtrl.create({
        
        title: 'Unsuccessful!',
  
        subTitle: "Password Not Changed",
  
        buttons: ['OK']
  
      });

      alert.present();

    }  

  }

  mismatch() {
    
    let alert = this.alertCtrl.create({
      
      title: 'Error!',

      subTitle: "Passwords Do Not Match",

      buttons: ['OK']

    });

    alert.present(); 
    
  }

  presentToast() {

    let toast = this.toastCtrl.create({

      message: 'Kindly fill in all the details',

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


  presentToaster() {

    let toast = this.toastCtrl.create({

      message: ' Incorrect Old Password',

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

    console.log('ining')

    let loading = this.loadingCtrl.create({
      
      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {
  
      if (this.pass.password == this.pass.confirm){
  
        const bodys={
          
          id:this.id,
    
          password:this.pass.password,
              
        }

        if(this.id == undefined || this.id == null){

          return this.presentLoadingText()

        }
            
        this.http.post('http://142.93.7.234:84/api/ResetUserPassword/', bodys)

          .subscribe(res => {

            console.log({'success':res});

            this.storage.remove('cards').then((val) => {

              console.log(res)

            });

            this.pass.confirm = '';

            this.pass.password = '';

            this.storage.set('cards',res)

            this.showAlert(res)
            
        }, (err) => {

          console.log({'error':err});

          this.pass.confirm = '';
          
          this.pass.password = '';

          this.showAlert({status_code: 500})

        });
  
      } else {
  
        this.mismatch()
        
      }
      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);
    
  }

}
