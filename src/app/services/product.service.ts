import { Product } from './../models/product';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  productRefs: AngularFireList<Product>;

  constructor(private db: AngularFireDatabase) {
    this.productRefs = this.db.list<Product>('/products/');
  }

  create(product){
    this.productRefs.push(product);
  }

  getAll(){
    return this.productRefs.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const $key = a.key;
          const value = a.payload.val() as Product;
          return {$key, ...value};
        });
      }));
  }

  get(productId){
    return this.db.object<Product>('/products/' + productId).valueChanges();
  }

  update(productId, product: Product){
    return this.db.object<Product>('/products/' + productId).update(product);
  }

  delete(productId){
    return this.db.object<Product>('/products/' + productId).remove();
  }
}
