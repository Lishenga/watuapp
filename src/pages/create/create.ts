import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { FirstLoginPage } from '../first-login/first-login';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the CreatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-create',

  templateUrl: 'create.html',

})
export class CreatePage {

  @ViewChild('input') myInput;

  creator = {email:'',password:'',fname:'',lname:'',msisdn:'', country:''}

  constructor(public navCtrl: NavController, private storage: Storage, public navParams: NavParams,private http: HttpClient,private toastCtrl: ToastController, public loadingCtrl: LoadingController,) {

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad CreatePage');

  }

   validateEmail() {

    if(this.creator.password == '' || this.creator.email == '' || this.creator.fname == '' || this.creator.lname == '' || this.creator.msisdn == '' || this.creator.country == ''){

      return this.presentToast('Kindly fill in all the details')

    }else{

      let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if(re.test(this.creator.email))
      {

        this.presentLoadingText()

      }else{

          this.presentToast('Kindly Provide a Valid Email Address')
          
      }

    }

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
  
      const body={
        
        fname:this.creator.fname,
    
        lname:this.creator.lname,
    
        email:this.creator.email.toLowerCase(),
    
        msisdn:this.creator.msisdn,
    
        password:this.creator.password, 
        
        country_code:this.creator.country
            
      }

      this.storage.set('country', this.creator.country);
  
      console.log(body)
    
        this.http.post('http://142.93.7.234:84/api/CreateCustomer/', body)

          .subscribe(res => {

            console.log({'success':res});

            this.navCtrl.push(FirstLoginPage, {email: this.creator.email.toLowerCase()});
            
            this.presentToast('Registration Successful');  

        }, (err) => {

          console.log({'error':err});

          this.presentToast('Kindly Try Again');

        });

      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
