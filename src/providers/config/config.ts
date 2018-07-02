import { Injectable } from '@angular/core';


@Injectable()
export class ConfigProvider {

  configGlobal ={
    fotoUrl:null
  }

  constructor() {
    //REcuperando os dados
    let dados = JSON.parse(localStorage.getItem("configGlobal"));
    if(dados!=null){
      this.configGlobal.fotoUrl = dados.fotoUrl;
    }
  }

  getConfigData() : any {
    return localStorage.getItem("config");
}

  setConfigData(showSlide : boolean){
    let config = {
      showSlide : false,
    }
    if(showSlide)
    config.showSlide = showSlide;

    localStorage.setItem("config", JSON.stringify(config));
  }

  setConfigFotoUrl(path:string){
    this.configGlobal.fotoUrl = path;
    localStorage.setItem("configGlobal",JSON.stringify(this.configGlobal));
  }

  getConfigFotoUrl() : any{
    return this.configGlobal.fotoUrl;
  }
}
