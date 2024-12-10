import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';

import { PlacesService } from '../places.service';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})
export class AvailablePlacesComponent implements OnInit {
  places = signal<Place[] | undefined>(undefined);
  isFeching = signal(false)
  error = signal('');
  private placesService = inject(PlacesService)
  private destroyRef = inject(DestroyRef)

  ngOnInit() {
    this.isFeching.set(true);
    const subscription = this.placesService.loadAvailablePlaces()
    .subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (error:Error) =>{
        this.error.set(error.message);
      },
      complete: () => {
        this.isFeching.set(false)

      }
    });



  }

  onSelectPlace(selectedPlace: Place){
    const subscription = this.placesService.addPlaceToUserPlaces(selectedPlace)
    .subscribe({
      next: (resData) => console.log(resData)
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    })
  }
}