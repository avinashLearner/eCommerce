import { Product } from './../../models/product';
import { ProductService } from './../../services/product.service';
import { CategoryService } from './../../services/category.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product;
  categories$;
  productId;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private productService: ProductService) {
    this.categories$ = categoryService.getAll();

    this.product = {title: '', price: 0, category: '', imageUrl: ''};
    this.productId = this.route.snapshot.paramMap.get('id');

    if (this.productId)
    {
      this.productService.get(this.productId).pipe(take(1)).subscribe(p => this.product = p);
    }
  }

  ngOnInit() {
  }

  save(product){
    if(this.productId)
    {
      this.productService.update(this.productId, this.product);
    } else
    {
      this.productService.create(product);
    }

    this.router.navigate(['/admin/products']);
  }

  delete(){
    if (!confirm('Are you sure, you want to delte this product?')){
      return;
    }

    this.productService.delete(this.productId);
    this.router.navigate(['/admin/products']);
  }
}
