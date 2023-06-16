import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Country } from '../interfaces/country.interface';

import {catchError, delay, map, tap} from 'rxjs/operators';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private apiUrl = 'https://restcountries.com/v3.1'

  public cacheStore:CacheStore = {
    byCapital: {term: '', countries:[] },
    byCountry: {term: '', countries:[] },
    byRegion: { region: '', countries:[] },
  }

  constructor(private http:HttpClient) { 
    this.loadLocalStorage();
  }

  private getCountriesRequest(url:string):Observable<Country[]>{
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of([])),
      )
  }

  public searchCountryByAlphaCode(alphaCode:string):Observable<Country | null>{

    const url = `${this.apiUrl}/alpha/${alphaCode}`;

    return this.http.get<Country[]>( url )
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null),
        catchError( error => of( null ) )
      );
  }

  public searchCapital(term:string):Observable<Country[]>{
    
    const url = `${this.apiUrl}/capital/${term}`;
    
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCapital = {term, countries}),
        tap( () => this.saveLocalStorage())
      );
  
  }

  public searchCountry(term:string):Observable<Country[]>{

    const url = `${this.apiUrl}/name/${term}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byCountry = {term, countries}),
        tap( () => this.saveLocalStorage())
      );

  }

  public searchRegion(region: Region):Observable<Country[]>{

    const url = `${this.apiUrl}/region/${region}`;
    return this.getCountriesRequest(url)
      .pipe(
        tap( countries => this.cacheStore.byRegion = {region, countries}),
        tap( () => this.saveLocalStorage())
      );
  }

  //*****************************************************Local Storage Stuff******************************************************** */

  private loadLocalStorage():void{
    if (!localStorage.getItem('cache')) return;

    this.cacheStore = JSON.parse(localStorage.getItem('cache')!);

  }

  private saveLocalStorage():void{
    localStorage.setItem('cache', JSON.stringify(this.cacheStore));
  }

}
