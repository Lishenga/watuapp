import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Slides } from 'ionic-angular';

/**
 * Generated class for the CardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-card',

  templateUrl: 'card.html',

})
export class CardPage {

  @ViewChild('input') myInput;

  @ViewChild(Slides) slides: Slides;

  stripe = {number:'',cvc:'', year:'', month:''}

  _token: Array<{email: any, fname: string}>

  cards: any

  value = []

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public navParams: NavParams,public loadingCtrl: LoadingController, private http: HttpClient,private toastCtrl: ToastController,private storage: Storage,) {
    
    this.cards = this.navParams.get('value')

    for(let item of this.cards.data.data){
  
      this.value.push(item)

    }

    this.storage.get('_token').then((val) => {

        this._token = val.data.email;

    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad CardPage');

  }

  slideChanged() {

    let currentIndex = this.slides.slideNext(200, true);

    console.log('Current index is', currentIndex);

  }

  delete(){

    let alert = this.alertCtrl.create({

      subTitle: 'Delete Card',

      message: 'Do you want to delete this Card?',

      buttons: [

        {
          text: 'Cancel',

          role: 'cancel',

          handler: () => {

            console.log('Cancel clicked');

          }

        },

        {

          text: 'Delete',

          handler: () => {

            console.log('Buy clicked');

          }

        }

      ]

    });

    alert.present();
    
  }

  createStripeCard(){

    // go to the MyPage component

    if(this.stripe.month == '' || this.stripe.year == '' || this.stripe.cvc == '' || this.stripe.number == ''){

      return

    }else{

      this.presentLoadingText()

    }
    

  }


  showAlert(res) {

    if(res.status_code == 200){
      
      let alert = this.alertCtrl.create({
        
        title: 'Success!',
  
        subTitle: "Card Successfully Added",
  
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
  
  presentLoadingText() {

    console.log('ining')

    let loading = this.loadingCtrl.create({

      content: 'Please Wait...'

    });
  
    loading.present();
  
    setTimeout(() => {

      const bodys={
        
        email:this._token,
    
        number:this.stripe.number,
    
        exp_month:this.stripe.month,
    
        exp_year:this.stripe.year,
    
        cvc:this.stripe.cvc,
            
      }
        
        this.http.post('http://142.93.7.234:84/api/CreateStripeCard/', bodys)

        .subscribe(res => {

          this.stripe.cvc = '';

          this.stripe.month = '';

          this.stripe.number = '';

          this.stripe.year = '';

          this.showAlert(res)
          
      }, (err) => {

        console.log({'error':err});

        this.stripe.cvc = '';
        
        this.stripe.month = '';

        this.stripe.number = '';

        this.stripe.year = '';

        this.showAlert({status_code: 500})

      });
      
    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);

  }

}
