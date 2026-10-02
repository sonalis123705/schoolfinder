import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
selector: 'app-login',
standalone: true,
imports: [FormsModule, RouterLink],
templateUrl: './login.html',
styleUrl: './login.css'
})
export class Login {

email = '';
password = '';

//apiUrl = 'http://localhost:3000';
apiUrl='https://schoolfinder-3moq.vercel.app'

message = '';
errorMessage = '';

constructor(
private http: HttpClient,
private router: Router
) {}

login() {


this.message = '';
this.errorMessage = '';

const loginData = {
  email: this.email,
  password: this.password
};

this.http.post<any>(
  `${this.apiUrl}/api/login`,
  loginData
).subscribe({

  next: (response) => {

    console.log('Login Response:', response);

    // Save JWT token
    localStorage.setItem('token', response.token);

    // Save user information
    localStorage.setItem(
      'user',
      JSON.stringify(response.user)
    );

    this.message = response.message;

    // Redirect to Home page
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);

  },

  error: (error) => {

    console.log('Login Error:', error);

    this.errorMessage =
      error.error?.message || 'Login failed';

  }

});


}

}
