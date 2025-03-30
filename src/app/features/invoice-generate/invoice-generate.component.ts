import { ChangeDetectorRef, Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, map, Observable, startWith } from 'rxjs';
import { InvoiceDialogComponent } from 'src/app/Popups/invoice-dialog/invoice-dialog.component';
import { Customer, DataService, Product } from 'src/app/services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/Popups/confirm-dialog/confirm-dialog.component';
@Component({
  selector: 'app-invoice-generate',
  templateUrl: './invoice-generate.component.html',
  styleUrls: ['./invoice-generate.component.scss']
})
export class InvoiceGenerateComponent {
  products: Product[] = [];
  customers: Customer[] = [];
  selectedCustomer: number = 0;
  private selectedProductsSubject = new BehaviorSubject<any[]>([]);
  selectedProducts$: Observable<any[]> = this.selectedProductsSubject.asObservable();
  private _discount: number = 0;
  customerSearchControl = new FormControl('');
  productSearchControl = new FormControl('');
  filteredCustomers: any[] = [];
  filteredProducts: any[] = [];
  private _applyDiscount: boolean = false;
  private productErrors = new Map<number, string>();
  
  constructor(
    private dataService: DataService, 
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
    private dialog: MatDialog,
  ) {
    
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.loadProducts();

    this.customerSearchControl.valueChanges
      .pipe(
        startWith(''), 
        map((value) => this.filterCustomers(value))
      )
      .subscribe((filteredCustomers) => {
        this.filteredCustomers = filteredCustomers;
    });

    this.productSearchControl.valueChanges
    .pipe(
      startWith(''),
      map((value) => this.filterProducts(value))
    )
    .subscribe((filteredProducts) => {
      this.filteredProducts = filteredProducts;
    });
  }

  onCustomerFieldFocus(): void {
    this.filteredCustomers = [...this.customers];
  }
  onProductFieldFocus(): void {
    this.filteredProducts = [...this.products];
  }

  loadProducts(): void {
    this.dataService.getProducts().subscribe(
      (data: Product[]) => {
        console.error('Get Products :', data);
        this.products = data;
        this.filteredProducts = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  loadCustomers(): void{
    this.dataService.getCustomers().subscribe(
      (data: Customer[]) => {
        console.error('Get Data from Backend :', data);
        this.customers = data;
        this.filteredCustomers = data;
      },
      (error) => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  filterCustomers(value: string | null): Customer[] {
    const filterValue = (value || '').toString().toLowerCase();
    return this.customers.filter((customer) =>
      customer.cus_Name.toLowerCase().includes(filterValue)
    );
  }

  filterProducts(value: string | null): Product[] {
    const filterValue = (value || '').toString().toLowerCase();
    return this.products.filter((product) =>
      product.productName.toLowerCase().includes(filterValue)
    );
  }

  getProductError(productID: number): string | undefined {
    return this.productErrors.get(productID);
  }

  validateQuantity(product: any): void {
    if (product.quantity > product.stockQuantity) {
      product.quantity = product.stockQuantity; 
      this.toastr.error(`Exceed the Stock Quantity for ${product.productName}. Maximum Quantity ${product.stockQuantity}.`);
    } else if (product.quantity < 1) {
      product.quantity = 1; 
    }
  }

  validateKeyPress(event: KeyboardEvent): void {
    const inputChar = event.key;

    if (!/^\d$/.test(inputChar) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(inputChar)) {
      event.preventDefault(); // Block invalid characters
      return;
    }

    const inputElement = event.target as HTMLInputElement;
    const currentValue = inputElement.value;

    const newValue = currentValue.slice(0, inputElement.selectionStart || 0) + inputChar + currentValue.slice(inputElement.selectionEnd || 0);

    const parsedValue = parseFloat(newValue);

    if (parsedValue > 100) {
      event.preventDefault();
    }
  }

  onProductSelected(product: Product): void {
    if (product.stockQuantity === 0) {
      this.toastr.error(`${product.productName} is out of stock.`);
      return;
    }
    const currentProducts = this.selectedProductsSubject.getValue();
    const existingProduct = currentProducts.find(
      (p) => p.productID === product.productID
    );

    if (existingProduct) {
      if (existingProduct.quantity && existingProduct.quantity < existingProduct.stockQuantity) {
        existingProduct.quantity += 1;
      }
    } else {
      currentProducts.push({ ...product, quantity: 1 });
    }
    this.selectedProductsSubject.next(currentProducts);
    console.log('Updated selectedProducts:', currentProducts);
    this.productSearchControl.setValue('');
  }

  get discount(): number {
    return this._discount;
  }

  set discount(value: number) {
    this._discount = Math.max(0, Math.min(100, value));
  }

  get applyDiscount(): boolean {
    return this._applyDiscount;
  }

  validateDiscount(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const parsedValue = parseFloat(input);

    if (isNaN(parsedValue)) {
      this.discount = 0;
    } else {
      this.discount = parsedValue;
    }
  }

  set applyDiscount(value: boolean) {
    if (!value) {
      this.discount = 0;
    }
    this._applyDiscount = value;
  }

  get totalAmount(): string {
    const currentProducts = this.selectedProductsSubject.getValue();
    const total = currentProducts.reduce(
      (sum, product) => sum + product.price * (product.quantity || 0),
      0
    );
    return total.toFixed(2);
  }

  get discountAmount(): string {
    if (this.applyDiscount) {
      const discount = (this.discount / 100) * parseFloat(this.totalAmount);
      return discount.toFixed(2);
    }
    return '0.00';
  }

  get balanceAmount(): string {
    const total = parseFloat(this.totalAmount);
    const discount = parseFloat(this.discountAmount);
    const balance = total - discount;
    return balance.toFixed(2);
  }

  removeProduct(productToRemove: any): void {
    const currentProducts = this.selectedProductsSubject.getValue();
    const updatedProducts = currentProducts.filter(
      (product) => product.productID !== productToRemove.productID
    );
  
    this.selectedProductsSubject.next(updatedProducts);
    console.log('Removed Product:', productToRemove);
  }

  onSubmit(): void {
    const currentProducts = this.selectedProductsSubject.getValue();
    if (!this.customerSearchControl.value) {
      this.toastr.error('Please select a customer.');
      return;
    }

    if (currentProducts.length === 0) {
      this.toastr.error('Please add at least one product Before Generate the Invoice');
      return;
    }

    if (this.applyDiscount && (this.discount === null || this.discount === 0)) {
      this.toastr.error('Please enter a valid discount percentage greater than 0.');
      return;
    }

    this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        // Set request payload
        const invoiceData = {
          CustomerName: this.customerSearchControl.value,
          TotalAmount: this.totalAmount,
          Discount: this.discountAmount,
          BalanceAmount: this.balanceAmount,
          Products: currentProducts.map(product => ({
            ProductID: product.productID,
            Quantity: product.quantity,
            Price: product.price
          }))
        };

        // Call the API via the service
        this.dataService.generateInvoice(invoiceData).subscribe({
          next: (response: any) => {
            console.log("Response Here :",response)
            this.dialog.open(InvoiceDialogComponent, {
              width: '800px',
              disableClose: true,
              data: { invoice: response.invoice }
            });
            this.clearForm();
            this.loadProducts();
          },
          error: (error) => {
            this.toastr.error('Failed to generate invoice. Please try again.');
            console.error('Error generating invoice:', error);
          }
        });
      }
    });
    
  }

  clearForm(): void {
    this.customerSearchControl.setValue('');
    this.selectedProductsSubject.next([]);
    this._discount = 0;
    this._applyDiscount = false;
  }
}