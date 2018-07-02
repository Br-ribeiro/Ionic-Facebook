import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MovieProvider } from '../../providers/movie/movie';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { FilmeDetalhesPage } from '../filme-detalhes/filme-detalhes';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [
    MovieProvider
  ]
})
export class HomePage {
  private loader;
  public titulo: string = "Filmes";
  public listaFilmes = new Array<any>();
  public infiniteScroll;
  public page = 1;
  public refresh;
  public isRefreshing: boolean = false;


  constructor(public navCtrl: NavController, public movieProvider: MovieProvider, public loadingCrtl: LoadingController) {

  }
  ionViewDidEnter() {
    this.carregarFilmes();

  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.infiniteScroll = infiniteScroll;
    this.carregarFilmes(true);
  }
  doRefresh(refresh) {
    this.refresh = refresh;
    this.isRefreshing = true;
    this.carregarFilmes();
  }
  carregarFilmes(newpage: boolean = false) {
    this.openLoading();

    this.movieProvider.getLatestMovies(this.page).subscribe(data => {
      const response = (data as any);
      if (newpage) {
        this.listaFilmes = this.listaFilmes.concat(response.results);
        this.infiniteScroll.complete();
      } else {
        this.listaFilmes = response.results;
      }

      if (this.isRefreshing) {
        this.refresh.complete();
        this.isRefreshing = false;
      }


      console.log(data);
      this.closeLoading();
    }, error => {
      console.log(error);
      this.closeLoading();

      if (this.isRefreshing) {
        this.refresh.complete();
        this.isRefreshing = false;
      }

    });
  }

  openLoading() {
    this.loader = this.loadingCrtl.create({
      content: "Carregando filmes..."
    });
    this.loader.present();
  }

  closeLoading() {
    this.loader.dismiss();
  }

  abrirDetalhes(filmes){
    this.navCtrl.push(FilmeDetalhesPage, {id: filmes.id});
  }
}
