import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {LoginStates, MatSnackbarStyle} from '../../enums';
import {Router} from '@angular/router';
import {SnackbarService} from '../../services/snackbar.service';
import {GetAccessTokenRequest} from '../../domain';

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
        apiKey: ['', Validators.required],
        apiSecret: ['', Validators.required]
      }
    )
    ;
  }

  submit(): void {
    let credentialObj: GetAccessTokenRequest;
    credentialObj = {
      // @ts-ignore
      apiKey: this.form.get('apiKey').value,
      // @ts-ignore
      apiSecret: this.form.get('apiSecret').value
    };
    this.authService.logIn(credentialObj);
  }
}
