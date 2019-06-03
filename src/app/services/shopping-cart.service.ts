import { ShoppingCartItem } from './../models/shopping-cart-item';
import { take, map } from 'rxjs/operators';
import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }

  async getCart() {
    const cartId = await this.getOrCreateCartId();
    return this.db.object('/shopping-carts/' + cartId).valueChanges().pipe(
      map(x => new ShoppingCart(x['items']))
    );
  }

  async addToCart(productArgs: Product) {
    this.updateItem(productArgs, 1);
  }

  async removeFromCart(productArgs: Product) {
    this.updateItem(productArgs, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }

  private create(){
    return this.db.list('/shopping-carts').push({
      dateCreated: new Date().getTime()
    });
  }

  private getItem(cartId: string, productKey: string) {
    return this.db.object<ShoppingCartItem>('/shopping-carts/' + cartId + '/items/' + productKey);
  }

  private async getOrCreateCartId(): Promise<string> {
    const cartId = localStorage.getItem('cartId');

    if (cartId) { return cartId; }

    const result = await this.create();
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(productArgs: Product, change: number) {
    const $key = productArgs['$key'];
    const cartId = await this.getOrCreateCartId();
    let items = this.getItem(cartId, $key);

    items.valueChanges().pipe(take(1)).subscribe( item => {
      let quantity = (item ? item.quantity : 0) + change;

      if(quantity === 0) {
        items.remove();
      } else {
        items.update({
          title: productArgs.title,
          imageUrl: productArgs.imageUrl,
          price: productArgs.price,
          quantity
        });
      }
    });
  }
}
