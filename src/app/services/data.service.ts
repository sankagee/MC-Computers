import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Customer {
  customerID: number;
  cus_Name: string;
  email: string;
  Phone: string;
  Address: string;
  CreatedAt: Date;
}
export interface Product {
  productID: number;
  productName: string;
  price: number;
  stockQuantity: number;
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'https://localhost:7250/api';

  constructor(private http: HttpClient) { }

  // Fetch customers
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customer`);
  }

  // Fetch products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  // Generate Invoice and update products quantity
  generateInvoice(invoiceData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/invoice/generate-invoice`, invoiceData);
  }
}
