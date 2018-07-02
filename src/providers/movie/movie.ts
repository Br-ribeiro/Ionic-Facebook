import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable()
export class MovieProvider {
  private baseApiPath = "https://api.themoviedb.org/3";
  private apiKey      = "b0d60d07ce38e1111acc15771909a25d";

  constructor(public http: HttpClient) {
    console.log('Hello MovieProvider Provider');
  }

  getLatestMovies(page = 1){
    return this.http.get(this.baseApiPath + `/movie/popular?page=${page}&api_key=` + this.apiKey + "&language=pt-BR");
  }

  getMovieDetails(filmeid){
    return this.http.get(this.baseApiPath + `/movie/${filmeid}?api_key=` + this.apiKey + "&language=pt-BR");
  }

}
