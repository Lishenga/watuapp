import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams, App, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { MenuController } from 'ionic-angular';
import { FirstLoginPage } from '../first-login/first-login';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-profile',

  templateUrl: 'profile.html',

})

export class ProfilePage {

  @ViewChild('input') myInput;

  creator = {email:'',fname:'',lname:'',msisdn:'', country:''}

  id: any

  lname: any 

  msisdn: any

  fname: any 

  email: any  

  country : any

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public menuCtrl: MenuController, private app: App, public navParams: NavParams,private http: HttpClient,private toastCtrl: ToastController, private storage: Storage, public loadingCtrl: LoadingController,) {

    this.storage.get('_token').then((val) => {

      if(val == null || val == undefined){

        return this.app.getRootNav().setRoot(HomePage);

      }else{

        this.id = val.data.id;

        this.lname = val.data.lname;
  
        this.msisdn = val.data.msisdn
  
        this.fname = val.data.fname
  
        this.email = val.data.email

        this.country = val.data.country_code

      }

    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ProfilePage');

  }

  ionViewWillEnter() {

    this.menuCtrl.close();
  }

  ionViewDidLeave() {

      this.menuCtrl.swipeEnable( true )
  }

  validateEmail() {

    alert(this.creator.email)

    if(this.creator.email == '' || this.creator.fname == '' || this.creator.lname == '' || this.creator.msisdn == '' ){

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

  showAlert(res) {

    if(res.status_code == 200){

      let alert = this.alertCtrl.create({
        
        title: 'Success!',
  
        subTitle: 'Details Changed Successfully',
  
        buttons: ['OK']
  
      });
  
      alert.present();

    }else{

      let alert = this.alertCtrl.create({
        
        title: 'Unsuccessful!',
  
        subTitle: "Kindly Try Again",
  
        buttons: ['OK']
  
      });
  
      alert.present();
    }

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

        id: this.id
            
      }
  
      console.log(body)
    
        this.http.post('http://142.93.7.234:84/api/UpdateCustomer/', body)

          .subscribe(res => {

            console.log({'success':res});

            this.storage.set('_token',res)

            this.creator.fname = '';
            
            this.creator.lname = '';

            this.creator.country = '';

            this.creator.email = '';

            this.creator.msisdn = '';
            
            this.showAlert(res);  

        }, (err) => {

          console.log({'error':err});

          this.creator.fname = '';
            
          this.creator.lname = '';

          this.creator.country = '';

          this.creator.email = '';

          this.creator.msisdn = '';

          this.showAlert({status_code: 500});  

        });

      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
