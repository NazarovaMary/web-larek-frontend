import { IOrder, IOrderSuccess, IProductCard } from '../../types';
import { Api, ApiListResponse } from './api';

interface ILarekAPI {
  getProductList: () => Promise<IProductCard[]>
  getProduct: (id: string) => Promise<IProductCard>
  orderProduct: (order: IOrder) => Promise<IOrderSuccess>
}

export class LarekAPI extends Api implements ILarekAPI {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options);
    this.cdn = cdn;
  }

  getProduct(id: string): Promise<IProductCard> {
    return this.get(`/product/${id}`).then(
      (item: IProductCard) => ({
        ...item,
        image: this.cdn + item.image
      })
    )
  }

  getProductList(): Promise<IProductCard[]> {
    return this.get('/product').then((data: ApiListResponse<IProductCard>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
}

  orderProduct(order: IOrder): Promise<IOrderSuccess> {
    return this.post(`/order`, order)
    .then((data: IOrderSuccess) => data)
  }
}