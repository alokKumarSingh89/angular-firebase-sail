import { Component, Input, OnInit } from '@angular/core';

import { NbMenuService, NbSidebarService } from '@nebular/theme';
import { UserService } from '../../../@core/data/users.service';
import { take } from 'rxjs/operator/take';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {


  @Input() position = 'normal';

  user: any;
  profile:any;
  name = localStorage.getItem('email');

  userMenu = [{ title: 'Edit Profile', link: "/pages/profile/edit" }, 
              { title: 'Log out', link: "/auth/logout" }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private userService: UserService) {
    this.profile = localStorage.getItem('profile_image_URL');
    console.log(this.profile);
  }

  ngOnInit() {
    this.userService.getUsers()
      .subscribe((users: any) => { 
              this.user = users.nick;
            });
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    return false;
  }

  toggleSettings(): boolean {
    this.sidebarService.toggle(false, 'settings-sidebar');
    return false;
  }

  goToHome() {
    this.menuService.navigateHome();
  }


}
