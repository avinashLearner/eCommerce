import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ShoppingCart } from '../models/shopping-cart';
import { OrderService } from '../services/order.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from '../models/order';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
// tslint:disable-next-line: no-input-rename
  @Input('cart') cart: ShoppingCart;
  shipping = {name: '', phone: '', email: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode:''};
  userId: string;
  userSubscription: Subscription;
  BASE_URL = "https://www.mapquestapi.com/geocoding/v1/reverse?key=IuOfdfAAQwmEkRRs1SQCbZny0Hz3pCg0&location=";

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router,
    private httpClient: HttpClient
    ) { }

  ngOnInit() {
    this.userSubscription = this.authService.user$.subscribe(user => {
      this.userId = user.uid;
      this.shipping.name = user.displayName;
      this.shipping.email = user.email;
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

  placeOrder() {
    const order = new Order(this.userId, this.shipping, this.cart);
    this.orderService.placeOrder(order).then(result => {
      this.router.navigate(['/order-success', result.key]);
    });
  }

  getLocation() {
    if(navigator.geolocation) {
      navigator.geolocation.watchPosition((position) => {
        this.httpClient.get(this.BASE_URL + position.coords.latitude + ',' + position.coords.longitude).subscribe(res => {
          var results = res['results'][0];
          var location = results['locations'][0];

          this.shipping.state = location['adminArea3'];
          this.shipping.city = location['adminArea5'];
          this.shipping.pincode = location['postalCode'];
        });
      });
    }
  }
}
