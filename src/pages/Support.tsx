import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import { callOutline, logoWhatsapp, mailOutline, search } from 'ionicons/icons';
import { useHistory } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import { photo } from './Summary';
import './Support.css';

const Support: React.FC = () => {
  const email = 'support@fintech.com';
  const history = useHistory();

  //redirect user to call
  const callSupport = () => {
    redirectToUrl('tel:+22501234567');
  }
  //redirect user to send email
  const emailSupport = () => {
    redirectToUrl(`mailto:${email}`);

  }
  //redirect user to send whatsapp
  const whatsappSupport = () => {
    redirectToUrl('https://wa.me/22501234567');
  }


  return (
    <IonPage>
      <IonToolbar className="app-header">
        <IonButtons>
          <IonButton slot="start">
            <IonIcon icon={search}></IonIcon>
          </IonButton>
        </IonButtons>
          <IonAvatar slot="end" onClick={()=>history.push("/profile")} className='dp-photo' >
            <IonImg src={photo}></IonImg>
          </IonAvatar>
      </IonToolbar>
      <IonContent fullscreen>
        <IonToolbar>
          <IonTitle>Support</IonTitle>
        </IonToolbar>
        <IonToolbar>
          <IonItem button onClick={callSupport}>
            <IonIcon icon={callOutline} slot="start"></IonIcon>
            <IonLabel>+27 67 377 111 </IonLabel>
          </IonItem>
          <IonItem button onClick={emailSupport}>
            <IonIcon icon={mailOutline} slot="start"></IonIcon>
            <IonLabel>support@fintech.com</IonLabel>
          </IonItem>
          <IonItem button onClick={whatsappSupport}>
            <IonIcon icon={logoWhatsapp} slot="start"></IonIcon>
            <IonLabel>+27 67 377 111</IonLabel>
          </IonItem>
        </IonToolbar>
      </IonContent>
    </IonPage>
  );
};

export default Support;


function redirectToUrl(url: string) {
  const a = document.createElement('a');
  a.href = url;
  a.target = '__blank';
  a.click();
  document.removeChild(a);
}