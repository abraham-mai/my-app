import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Credentials} from '../../domain';
import {AuthService} from '../../services/auth.service';
import {LoginStates, MatSnackbarStyle} from '../../enums';
import {Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router,
              private snackbarService: SnackbarService) {
  }

  ngOnInit(): void {
    this.authService.loginStatus.subscribe(status => {
      if (status === LoginStates.loggedIn) {
        this.router.navigate(['main']);
      } else if (status === LoginStates.wrongCredentials) {
        this.snackbarService.sendNewMessage('Wrong credentials', MatSnackbarStyle.Error);
      }
    });
    this.form = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
      }
    )
    ;
  }

  submit(): void {
    let credentialObj: Credentials;
    credentialObj = {
      // @ts-ignore
      username: this.form.get('username').value,
      // @ts-ignore
      password: this.form.get('password').value
    };
    this.authService.logIn(credentialObj);
  }
}
