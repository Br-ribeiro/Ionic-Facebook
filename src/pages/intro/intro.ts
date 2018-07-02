import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';

/**
 * Generated class for the IntroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  slides = [
    {
      title: "Me adote!",
      description: "Preciso de um lar, venha ser meu papai...",
      image: "assets/imgs/Dog2.jpg",
    },
    {
      title: "Não tenho onde morar",
      description: "Estou <b>carente</b>, venha me fazer um carinho",
      image: "assets/imgs/Dog3.jpg",
    }
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  goPage(){
    this.navCtrl.setRoot(HomePage);
  }

}
