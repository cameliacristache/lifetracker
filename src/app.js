//import 'bootstrap';
import 'font-awesome';
import 'flat-ui/dist/css/flat-ui.css!';
import 'flat-ui/dist/js/flat-ui';
import 'moment';
import 'bootstrap-datepicker';

export class App {
  configureRouter(config, router){
    config.title = 'ifeTracker';
    config.map([
      { route: '',  name: 'home', moduleId: 'home', title:'Home' },
      { route: 'login',  name: 'login', moduleId: 'login', title:'Login' },
      { route: 'register',  name: 'register', moduleId: 'register', title:'Register' }
    ]);

    this.router = router;
  }
}
