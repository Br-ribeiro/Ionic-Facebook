import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, LoadingController, ActionSheetController, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { IntroPage } from '../pages/intro/intro';
import { ConfigProvider } from '../providers/config/config';

import { File } from '@ionic-native/file';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';

declare var cordova: any;

@Component({
  templateUrl: 'app.html',
  providers: [
    ConfigProvider
  ]
})




export class MyApp {
  @ViewChild(Nav) nav: Nav;
  lastImage: string;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;
  private loading;

  constructor(public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public configProvider: ConfigProvider,
    public loadindCtrl: LoadingController,
    private camera: Camera,
    private transfer: Transfer,
    private file: File,
    private filePath: FilePath,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController

  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.lastImage = this.configProvider.getConfigFotoUrl();
      
      let config = this.configProvider.getConfigData();
      if (config == null) {
        this.rootPage = IntroPage;
        this.configProvider.setConfigData(false);
      } else {
        this.rootPage = HomePage;
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Selecione uma imagem',

      buttons: [
        {
          text: 'Carregar da Biblioteca',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Usar Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancelar',
          role: 'Cancelar'
        }
      ]

    });
    actionSheet.present();
  }

  public takePicture(sourceType) {

    //Criar opções para a caixa de diálogo da câmera
    var options = {
      quality: 100,
      sourceType: sourceType,
      saveToPhotoAlbum: false,
      correctOrientation: true
    };

    //Obtendo as informações de uma imagem
    this.camera.getPicture(options).then((imagePath) => {
      //Handling para android library
      if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
        this.filePath.resolveNativePath(imagePath)
          .then(filePath => {
            let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
            let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
            this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
          });
      } else {
        var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
        var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
        this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
      }
    }, (err) => {
      this.presentToast('Erro ao selecionar imagem');
    });

  }

  //Cria um novo nome para a imagem
  private createFileName() {
    var d = new Date(),
      n = d.getTime(),
      newFileName = n + ".jpg";
    return newFileName;
  }

  //copie a imagem para uma pasta local
  private copyFileToLocalDir(namePath, currentName, newFileName){
    this.file.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success =>{
      this.lastImage = newFileName;
      this.uploadImage();
    }, error => {
      this.presentToast('Erro ao armazenar o arquivo');
    });
  }

  private presentToast(text){
    let toast = this.toastCtrl.create({
      message:text,
      duration:3000,
      position:'bottom'

    });
    toast.present();
  }

  // Obtendo o caminho exato para sua pasta de aplicativos
  public patthForImage(img){
    if(img === null){
      return '';
    }else{
      return cordova.file.dataDirectory + img;
    }
  }

  public uploadImage(){
    //URL Destino
    var url = "http://acruche.com.br/upload.php";

    //Arquivo para Upload
    var targetPath = this.patthForImage(this.lastImage);

    //Somente o nome  do arquivo
    var filename = this.lastImage;

    var options = {
      fileKey: "file",
      fileName:filename,
      chunkedMode:false,
      mimeType: "multipart/form-data",
      params:{'fileName':filename}
    };

    const fileTransfer: TransferObject = this.transfer.create();

    this.loading = this.loadindCtrl.create({
      content: 'Enviando...',
    });
    this.loading.present();

    //Usando o FileTranfer para fazer upload da imagem
    fileTransfer.upload(targetPath,url,options).then(data =>{
      this.loading.dismissAll()
      this.presentToast('Imagem atualizada com sucesso.');
    }, err =>{
      this.loading.dismissAll()
      this.presentToast('Não foi possivel atualizar a imagem.');
    });
  }

}
