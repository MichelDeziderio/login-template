import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger("animationForm", [
      state('shown', style({
        transform: 'translateY(100%)'
      })
      ), state('hidden', style({
        transform: 'translateY(0%)',
        opacity: 0,
        marginLeft: '-2000px'
      })
      ), transition('hidden => show', [
        animate('0.6s')
      ]),
    ])
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  loginForm: FormGroup;
  hidePassword: boolean = true;
  userLogin: any;
  state = 'hidden';

  constructor(
    public formBuilder: FormBuilder,
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      remember: [false]
    })
  }

  get f() {
    return this.loginForm;
  }

  ngOnInit(): void {

    this.userLogin = localStorage.getItem('saveUserLogin');

    if (this.userLogin) {

      const user = JSON.parse(this.userLogin);

      this.f.get('email')?.setValue(user.email);
      this.f.get('password')?.setValue(user.password);
      this.f.get('remember')?.setValue(true);

    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.state = 'show';
    }, 230);
  }

  saveInformations() {

    const email = this.f.get('email');
    const password = this.f.get('password');
    const remember = this.f.get('remember');

    if (remember?.value === false && this.f.valid) {
      this.f.reset();
      localStorage.removeItem('saveUserLogin');
      return;
    }

    if (this.f.valid) {

      const saveValues = { email: email?.value, password: password?.value };
      localStorage.setItem('saveUserLogin', JSON.stringify(saveValues));
      this.userLogin = JSON.stringify(saveValues);

    } else {

      this.f.get('remember')?.setValue(false);
      this.f.markAllAsTouched();

    }

  }

  validChangeForm() {

    const getFormSave = this.f.value;
    const validatUserSaved = JSON.stringify({ email: getFormSave.email, password: getFormSave.password })

    if (this.userLogin !== validatUserSaved) {
      this.f.get('remember')?.setValue(false);
    }
  }


}
