import { Product } from './product';
import { ShoppingCartItem } from './shopping-cart-item';

export class ShoppingCart {
    itemsMap: ShoppingCartItem[] = [];
    constructor(private items: { [productId: string]: ShoppingCartItem }) {
        this.items = items || {};
        // tslint:disable-next-line: forin
        for(let productId in items) {
            let item = items[productId];

            this.itemsMap.push(new ShoppingCartItem({ ...item, $key: productId }));
        }
    }

    get totalPrice() {
        let sum = 0;
        // tslint:disable-next-line: forin
        for(let productId in this.itemsMap) {
            sum += this.itemsMap[productId].totalPrice;
        }
        return sum;
    }

    get totalItemsCount() {
        let count = 0;
        // tslint:disable-next-line: forin
        for (let productKey in this.items) {
            count += this.items[productKey].quantity;
        }
        return count;
    }

    getQuantity(product: Product) {
        // tslint:disable-next-line: no-string-literal
        const item = this.items[product['$key']];
        return item ? item.quantity : 0;
    }
}
