import { ShoppingCart } from './../models/shopping-cart';
import { ShoppingCartService } from './../services/shopping-cart.service';
import { Product } from './../models/product';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent{
// tslint:disable-next-line: no-input-rename
  @Input('product') product: Product;
// tslint:disable-next-line: no-input-rename
  @Input('show-actions') showActions = false;
// tslint:disable-next-line: no-input-rename
  @Input('shopping-cart') shoppingCart: ShoppingCart;

  constructor(private cartService: ShoppingCartService, private router: Router) { }

  addToCart(){
    this.cartService.addToCart(this.product);
  }

  buyNow() {
    this.cartService.addToCart(this.product);
    this.router.navigate(['/check-out']);
  }
}
