import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public firstName: any;
  public lastName: any;
  public userName: any = '';

  public email: any;
  public password: any;
  public selectedCountry: any;
  public mobileNumber: any;
  public isAdmin: boolean = false;
  public countryName: string;
  public countryCode: string;
  public countryList: any[] = [];
  public countryCodes: string[];

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrService) { }
  ngOnInit() {
    this.getCountries()
  }


  public getCountries() {
    // get list of countries 
    this.appService.getCountries()
      .subscribe((responseList) => {
        for (let item in responseList) {
          this.countryList.push({ code: item, name: responseList[item] })
        }
        this.countryList = this.countryList.sort((first, second) => {
          return first.name.toUpperCase() < second.name.toUpperCase() ? -1 : (first.name.toUpperCase() > second.name.toUpperCase() ? 1 : 0);
        });
        this.getCountryCodes();
        this.selectedCountry = '';
        this.countryName = this.countryList[this.selectedCountry];
      })
  }

  public getCountryCodes() {
    // get list of country codes
    this.appService.getCountryCodes()
      .subscribe((data) => {
        this.countryCodes = data;
        this.countryCode = this.countryCodes['IN'];
      })
  }

  public onCountryChange() {
    // called when user change the country code
    this.countryCode = this.countryCodes[this.selectedCountry];
    this.countryName = this.countryList[this.selectedCountry];
  }

  public setUserName(): void {
    // if user singup as an admin then suffix the username with "-admin"
    if (this.isAdmin && this.userName !== '') {
      if (!this.userName.includes('-admin')) {
        this.userName = this.userName + '-admin'
      }
    } else {
      this.userName = this.userName.split('-admin')[0]
    }
  }

  public goToLogIn: any = () => {

    this.router.navigate(['login']);

  } // end goToSignIn

  public signupFunction: any = () => {

    if (!this.firstName) {
      this.toastr.warning('enter first name')


    }
    else if (!this.userName) {
      this.toastr.warning('username required');
    }
    else if (!this.lastName) {
      this.toastr.warning('enter last name')

    }

    else if (!this.mobileNumber) {
      this.toastr.warning('mobile number required');
    }

    else if (this.mobileNumber.toString().length != 10) {
      this.toastr.warning('Please enter 10 digit mobile number');
    }
    else if (!this.email) {
      this.toastr.warning('enter email')

    } else if (!this.password) {
      this.toastr.warning('enter password')


    }
    else {

      let data = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        mobileNumber: this.mobileNumber,
        userName: this.userName,
        isAdmin: this.isAdmin,
        countryName: this.selectedCountry,
        countryCode: this.countryCode
      }
      console.log(data);

      this.appService.signupFunction(data)
        .subscribe((apiResponse) => {
          console.log(apiResponse);

          if (apiResponse.status === 200) {

            this.toastr.success('Signup successful');

            setTimeout(() => {

              this.goToLogIn();

            }, 2000);

          } else {

            this.toastr.error(apiResponse.message);

          }

        }, (err) => {
          this.toastr.error('some error occured');

        });

    } // end condition

  } // end signupFunction

}
