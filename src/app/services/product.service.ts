import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  readonly API: string = environment.apiUrl + 'products';

  constructor(private httpClient: HttpClient) {}
  createProduct(Formdata: FormData) {
    return this.httpClient.post<any>(`${this.API}/product/new`, FormData);
  }
  getProductByProvider(providerId: string) {
    return this.httpClient.get<any>(`${this.API}/provider/${providerId}`);
  }
  updateProduct(formData: FormData, id: string) {
    return this.httpClient.put<any>(`${this.API}/product/${id}`, formData);
  }
  getProductCategories() {
    return this.httpClient.get<any>(`${this.API}/categories`);
  }
  getProductsByCategorieAndProvider(catId: string, providerId: string) {
    return this.httpClient.get<any>(
      `${this.API}/categorie/${catId}/providerr/${providerId}`
    );
  }
  getProducts() {
    return this.httpClient.get<any>(`${this.API}/all/`);
  }

  getProduct(id: string) {
    return this.httpClient.get<any>(`${this.API}/product/${id}`);
  }
}
export default ProductService;
