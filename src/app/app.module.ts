import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InvoiceGenerateComponent } from './features/invoice-generate/invoice-generate.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { InvoiceDialogComponent } from './Popups/invoice-dialog/invoice-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './Popups/confirm-dialog/confirm-dialog.component';
@NgModule({
  declarations: [
    AppComponent,
    InvoiceGenerateComponent,
    InvoiceDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule, 
    MatCardModule,
    FormsModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatTableModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    HttpClientModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Position the toastr at the top-right corner
      preventDuplicates: true,         // Prevent duplicate messages
      timeOut: 3000,                   // Auto-close after 3 seconds
      progressBar: true,               // Show a progress bar
      newestOnTop: true,               // New notifications appear on top
      enableHtml: true,                // Allow HTML content in messages
      toastClass: 'custom-toastr',     // Custom CSS class for styling
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
