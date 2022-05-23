import { Redirect, Route, useHistory } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { addOutline, ellipse, notificationsOutline, paperPlane, paperPlaneOutline, personOutline, sendOutline, square, timeOutline, triangle } from 'ionicons/icons';
import Tab1 from './pages/Summary';
import Tab2 from './pages/Payment';
import Tab3 from './pages/Support';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';
import "./App.css";

/* Theme variables */
import './theme/variables.css';
import Summary from './pages/Summary';
import Payment from './pages/Payment';
import Support from './pages/Support';
import Notifications from './pages/Nofications';
import NotificationDetail from './pages/NotificationDetail';
import Profile from './pages/Profile';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import FaceComparison from './pages/FaceComparison';
import { useEffect } from 'react';
import { User } from './components/interfaces/@entities';
import { selectUser, updateUser } from './components/States/User-state';
import { UserStorage } from './components/storageApi';
import { useDispatch, useSelector } from 'react-redux';
import { localImages } from './components/images/images';

setupIonicReact();

const App: React.FC = () => {

  //user from selector
  const user: User = useSelector(selectUser)
  const history = useHistory()

  //dispatch
  const dispatch = useDispatch()

  useEffect(() => {


    if (!user.email) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          const { latitude, longitude } = position.coords
          //get user info from storage
          UserStorage.getUser().then((user: User | null) => {
            if (user) {
              dispatch(updateUser({ ...user, photo: user.photo || localImages.profilePlaceholder, lat: latitude + "", lng: longitude + "" }))

              return
            }
            else {
              history.push('/sign-in')
            }
          })
        })
      }

    }




  }, [])

  useEffect(() => {


  }, [])



  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/summary">
              <Summary />
            </Route>
            <Route exact path="/payment">
              <Payment />
            </Route>
            <Route path="/support">
              <Support />
            </Route><Route exact path="/notifications">
              <Notifications />
            </Route>
            <Route path="/notifications/detail/:id">
              <NotificationDetail />
            </Route>
            <Route path="/face">
              <FaceComparison />
            </Route>
            <Route path="/profile">
              <Profile />
            </Route>

            <Route exact path="/">
              <Redirect to="/sign-in" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="tab1" href="/summary">
              <IonIcon icon={timeOutline} />
              <IonLabel>Summary</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab2" href="/payment">
              <IonIcon icon={paperPlaneOutline} />
              <IonLabel>Payment</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab3" href="/support">
              <IonIcon icon={personOutline} />
              <IonLabel>Support</IonLabel>
            </IonTabButton>
            <IonTabButton tab="tab4" href="/notifications">
              <IonIcon icon={notificationsOutline} />
              <IonLabel>Notifications</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
        <Route path="/sign-in">
          <SignIn />
        </Route>
        <Route path="/sign-up">
          <SignUp />
        </Route>
      </IonReactRouter>
    </IonApp>
  );
}

export default App;
