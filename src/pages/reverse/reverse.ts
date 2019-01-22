import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, Platform, App } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ToastController } from 'ionic-angular';
import { MenuController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import { CheckPage } from '../check/check';
import { HomePage } from '../home/home';
import { PasswordPage } from '../password/password';
import { ProfilePage } from '../profile/profile';
import { FilePath } from '@ionic-native/file-path';
import { Camera, CameraOptions } from '@ionic-native/camera'; 
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';


/**
 * Generated class for the ReversePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()

@Component({

  selector: 'page-reverse',

  templateUrl: 'reverse.html',

})

export class ReversePage {

  _token: Array<{fname: string, lname: string}>

  lname: Array<{fname: string, lname: string}>

  email:Array<{fname: string, lname: string}>

  msisdn:Array<{fname: string, lname: string}>

  stripe:Array<{fname: string, lname: string}>

  pass:Array<{fname: string, lname: string}>

  myphoto : string

  constructor(public navCtrl: NavController, public menuCtrl: MenuController, private app: App, public platform: Platform, private camera: Camera, public actionSheetCtrl: ActionSheetController, private file: File, private transfer: FileTransfer, private filePath: FilePath, public navParams: NavParams,private storage: Storage,public loadingCtrl: LoadingController, private http: HttpClient,private toastCtrl: ToastController) {
    
    this.myphoto = "assets/imgs/"
    
    this.storage.get('image').then((val) =>{

      this.myphoto = val

    })

    this.storage.get('_token').then((val) => {

      if(val == null || val == undefined){

        return this.app.getRootNav().setRoot(HomePage);

      }else{

        this._token = val.data.fname;

        this.lname = val.data.lname;

        this.email = val.data.email;

        this.msisdn = val.data.msisdn;

        this.stripe = val.data.stripe_id

      }

    });

  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ReversePage');

  }

  ionViewWillEnter() {

    this.menuCtrl.close();
  }

  ionViewDidLeave() {

      this.menuCtrl.swipeEnable( true )
  }


  public presentActionSheet() { 
    
    let actionSheet = this.actionSheetCtrl.create({

      title: 'Select Image Source',

      buttons: [

        {

          text: 'Load from Library',

          handler: () => {

            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);

          }

        },

        {

          text: 'Use Camera',

          handler: () => {

            this.takePicture(this.camera.PictureSourceType.CAMERA);

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
    
    
  public takePicture(sourceType) {

    // Create options for the Camera Dialog

    var options = {

      quality: 100,

      sourceType: sourceType,

      saveToPhotoAlbum: false,

      correctOrientation: true

    };
    
    // Get the data of an image

    this.camera.getPicture(options).then((imagePath) => {

      // Special handling for Android library

      this.myphoto = imagePath

      this.storage.set('image', imagePath)

      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {

        this.filePath.resolveNativePath(imagePath)

          .then(filePath => {

            let correctPath = this.file.dataDirectory

            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));

            this.copyFileToLocalDir(correctPath, currentName,);

          });

      } else {

        var correctPath  = this.file.dataDirectory

        var currentName = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);

        this.copyFileToLocalDir(correctPath, currentName,);

      }

    }, (err) => {

      this.presentToast('Error while selecting image.');

    });

  }


  // Copy the image to a local folder
  private copyFileToLocalDir(namePath, currentName) {

    this.file.createFile(namePath, currentName, true).then((success) =>{
      
      this.presentToast('Image Uploaded')

    }).catch((err) =>{

      this.presentToast('Image not stored')

    })

  }
     
  // Always get the accurate path to your apps folder
  public pathForImage(img) {
  
    if (img === null) {
  
      return '';
  
    } else {
  
      return this.file.dataDirectory + img;
  
    }
  
  }
    
  /*
  
  public uploadImage() {
  
    // Destination URL
  
    var url = "http://yoururl/upload.php";
    
    // File for Upload
  
    var targetPath = this.pathForImage(this.lastImage);
    
    // File name only
  
    var filename = this.lastImage;
    
    var options = {
  
      fileKey: "file",
  
      fileName: filename,
  
      chunkedMode: false,
  
      mimeType: "multipart/form-data",
  
      params : {'fileName': filename}
  
    };
    
    const fileTransfer: TransferObject = this.transfer.create();
    
    this.loading = this.loadingCtrl.create({
  
      content: 'Uploading...',
  
    });
  
    this.loading.present();
    
    // Use the FileTransfer to upload the image
    fileTransfer.upload(targetPath, url, options).then(data => {
  
      this.loading.dismissAll()
  
      this.presentToast('Image succesful uploaded.');
      
    }, err => {
  
      this.loading.dismissAll()
  
      this.presentToast('Error while uploading file.');
  
    });
    
  }
  
  */

  password() {

    // go to the MyPage component

    this.navCtrl.push(PasswordPage);

  }

  profile() {

    // go to the MyPage component

    this.navCtrl.push(ProfilePage);

  }

  check() {

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

      const sending={
        
        stripe_id:this.stripe,
            
      }

      if(this.stripe == undefined || this.stripe == null){
        
        this.presentLoadingText() 
      }

    console.log(sending)

      this.http.post('http://142.93.7.234:84/api/ViewAllCustomerCards/', sending)

      .subscribe(ress => {

        console.log({'success':ress});

        this.navCtrl.push(CheckPage, { allcards: ress });
        
    }, (err) => {

      console.log({'error':err});

    });


    }, 1000);

    setTimeout(() => {

      loading.dismiss();

    }, 3000);
    
  }

}
