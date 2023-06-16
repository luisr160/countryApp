import { Component, OnInit } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [
  ]
})
export class ByCountryPageComponent implements OnInit {

  public countries:Country[] = [];
  public isLoading:boolean = false;
  public initialValue:string = '';

  constructor(private countriesService:CountriesService ) { }

  ngOnInit(): void {
    this.countries = this.countriesService.cacheStore.byCountry.countries;
    this.initialValue = this.countriesService.cacheStore.byCountry.term;
  }

  public searchByCountry(searchTerm:string):void{
    this.isLoading = true;
    this.countriesService.searchCountry(searchTerm)
      .subscribe (countries => {
        this.countries = countries;
        this.isLoading = false;
      })
  }

}
