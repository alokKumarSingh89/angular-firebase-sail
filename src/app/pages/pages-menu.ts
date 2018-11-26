import { NbMenuItem } from '@nebular/theme';

// Create dynamically menu
let menuList = JSON.parse(localStorage.getItem('viewAccess'));

let menuArray: Array<any> = [];
let menuIcon: Array<any> = [];

menuIcon['Dashboard'] = "nb-home";
menuIcon['Broadcast'] = "nb-keypad";
menuIcon['Facilities'] = "nb-compose";
menuIcon['Members'] = "nb-gear";
menuIcon['Chat'] = "nb-star";
menuIcon['QuickChat'] = "nb-star";
menuIcon['Payments'] = "nb-tables";

for (let key in menuList) {

  let mainMenu = menuList[key];
  console.log("mainMenu",mainMenu,menuIcon)
  let menu: any = {};
  menu.title = mainMenu.dispName;
  menu.link = "/pages" + mainMenu.url;
  menu.icon = menuIcon[mainMenu.dispName];
  let childrenMenu: Array<any> = [];

  if (mainMenu.items != undefined) {
    for (let skey in mainMenu.items) {
      let subMenu = mainMenu.items[skey];
      let submenuObj: any = {};
      submenuObj.title = subMenu.dispName;
      submenuObj.link = "/pages" + subMenu.url;
      childrenMenu.push(submenuObj);
    }
    menu.children = childrenMenu;
  }
  menuArray.push(menu);
}

// Add Logout link at the last menu
let menu: any = {};
menu.title = 'Logout';
menu.link = "/auth/logout";
menu.icon = 'nb-power-circled';
menuArray.push(menu);

export const MENU_ITEMS: NbMenuItem[] = menuArray;

// export const MENU_ITEMS: NbMenuItem[] = [
//   {
//     title: 'Dashboard',
//     icon: 'nb-home',
//     link: '/pages/dashboard',
//     home: true,
//   },

//   {
//     title: 'FEATURES',
//     group: true,
//   },
//   {
//     title: 'UI Features',
//     icon: 'nb-keypad',
//     link: '/pages/ui-features',
//     children: [
//       {
//         title: 'Buttons',
//         link: '/pages/ui-features/buttons',
//       },
//       {
//         title: 'Grid',
//         link: '/pages/ui-features/grid',
//       },
//       {
//         title: 'Icons',
//         link: '/pages/ui-features/icons',
//       },
//       {
//         title: 'Modals',
//         link: '/pages/ui-features/modals',
//       },
//       {
//         title: 'Typography',
//         link: '/pages/ui-features/typography',
//       },
//       {
//         title: 'Animated Searches',
//         link: '/pages/ui-features/search-fields',
//       },
//       {
//         title: 'Tabs',
//         link: '/pages/ui-features/tabs',
//       },
//     ],
//   },
//   {
//     title: 'Forms',
//     icon: 'nb-compose',
//     children: [
//       {
//         title: 'Form Inputs',
//         link: '/pages/forms/inputs',
//       },
//       {
//         title: 'Form Layouts',
//         link: '/pages/forms/layouts',
//       },
//     ],
//   },
//   {
//     title: 'Components',
//     icon: 'nb-gear',
//     children: [
//       {
//         title: 'Tree',
//         link: '/pages/components/tree',
//       }, {
//         title: 'Notifications',
//         link: '/pages/components/notifications',
//       },
//     ],
//   },
//   {
//     title: 'Maps',
//     icon: 'nb-location',
//     children: [
//       {
//         title: 'Google Maps',
//         link: '/pages/maps/gmaps',
//       },
//       {
//         title: 'Leaflet Maps',
//         link: '/pages/maps/leaflet',
//       },
//       {
//         title: 'Bubble Maps',
//         link: '/pages/maps/bubble',
//       },
//     ],
//   },
//   {
//     title: 'Charts',
//     icon: 'nb-bar-chart',
//     children: [
//       {
//         title: 'Echarts',
//         link: '/pages/charts/echarts',
//       },
//       {
//         title: 'Charts.js',
//         link: '/pages/charts/chartjs',
//       },
//       {
//         title: 'D3',
//         link: '/pages/charts/d3',
//       },
//     ],
//   },
//   {
//     title: 'Editors',
//     icon: 'nb-title',
//     children: [
//       {
//         title: 'TinyMCE',
//         link: '/pages/editors/tinymce',
//       },
//       {
//         title: 'CKEditor',
//         link: '/pages/editors/ckeditor',
//       },
//     ],
//   },
//   {
//     title: 'Tables',
//     icon: 'nb-tables',
//     children: [
//       {
//         title: 'Smart Table',
//         link: '/pages/tables/smart-table',
//       },
//     ],
//   },
//   {
//     title: 'Auth',
//     icon: 'nb-locked',
//     children: [
//       {
//         title: 'Login',
//         link: '/auth/login',
//       },
//       {
//         title: 'Register',
//         link: '/auth/register',
//       },
//       {
//         title: 'Request Password',
//         link: '/auth/request-password',
//       },
//       {
//         title: 'Reset Password',
//         link: '/auth/reset-password',
//       },
//     ],
//   },
// ];
