import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient , HttpParams} from '@angular/common/http';
import { Globals } from '../../globals';
import { LoaderService } from '../../loader.service';
@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {

  dashboardContent:{};
  constructor(
    protected router: Router,
    private http: HttpClient,
    private globals: Globals,private loaderService: LoaderService) {

    }

    ngOnInit(): void {
      this.loaderService.display(true);
      if(!this.globals.isLogged()){
        this.router.navigate(["auth/login"]);
      }
     
      this.http.get(this.globals.API_URL + "/dashboard")
      .subscribe(
        res => {
          this.dashboardContent = res['widgets']
          this.loaderService.display(false);
        },
        err => {
          this.loaderService.display(false);
        }
      );

    }

   
    
}
