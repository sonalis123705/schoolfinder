import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
selector: 'app-register',
imports: [FormsModule, RouterLink],
templateUrl: './register.html',
styleUrl: './register.css'
})
export class Register {

name = '';
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

register() {

this.message = '';
this.errorMessage = '';

const user = {
  name: this.name,
  email: this.email,
  password: this.password
};

this.http.post<any>(
  `${this.apiUrl}/api/register`,
  user
).subscribe({

  next: (response) => {

    console.log('Register Response:', response);

    this.message = response.message;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);

  },

  error: (error) => {

    console.log('Register Error:', error);

    this.errorMessage =
      error.error?.message || 'Registration failed';

  }

});


}

}
