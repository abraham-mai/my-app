import { Component, OnDestroy, OnInit, Query } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LoginStates, MatSnackbarStyle } from '../../enums';
import { Router } from '@angular/router';
import { SnackbarService } from '../../services/snackbar.service';
import { GetAccessTokenRequest } from '../../domain';
import { UserService } from 'src/app/services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  form: FormGroup | undefined;
  private _userCheckedSub: Subscription | undefined;
  private _authSub: Subscription | undefined;
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    private userService: UserService
  ) {}
  ngOnDestroy(): void {
    this._userCheckedSub?.unsubscribe();
    this._authSub?.unsubscribe();
  }

  ngOnInit(): void {
    this._authSub = this.authService.loginStatus.subscribe((status) => {
      if (status === LoginStates.loggedIn) {
        this.userService.userKey = this.form?.get('apiKey')?.value || '';
      } else if (status === LoginStates.wrongCredentials) {
        this.snackbarService.sendNewMessage('Wrong credentials', MatSnackbarStyle.Error);
      }
    });

    this._userCheckedSub = this.userService.userChecked.subscribe((checked) => {
      if (checked) {
        if (this.userService.userFound) {
          this.router.navigate(['main']);
        } else if (!this.userService.userFound) {
          this.router.navigate(['config']);
        }
      } else {
        this.router.navigate(['login']);
      }
    });

    this.form = this.formBuilder.group({
      apiKey: ['', Validators.required],
      apiSecret: ['', Validators.required],
    });
  }

  submit(): void {
    let credentialObj: GetAccessTokenRequest;
    credentialObj = {
      // @ts-ignore
      apiKey: this.form.get('apiKey').value,
      // @ts-ignore
      apiSecret: this.form.get('apiSecret').value,
    };
    this.authService.logIn(credentialObj);
  }
}
