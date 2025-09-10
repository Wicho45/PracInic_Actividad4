import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  // loginForm: FormGroup = new FormGroup({
  //   CorreoId: new FormControl(""),
  //   Password: new FormControl("")
  // })

  // http = inject(HttpClient);
  
  // onLogin(){
  //   const formValue = this.loginForm.value;
  //   this.http.post("", formValue)
  // }
}
