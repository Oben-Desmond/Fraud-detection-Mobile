import { IonAvatar, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import { callOutline, logoWhatsapp, mailOutline, peopleOutline, search } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import { photo } from './Summary';
import './Notifications.css';
import { useEffect } from 'react';
import { useHistory } from 'react-router';

const Notifications: React.FC = () => {

    const history = useHistory();

    // compress image from url
    const compressImage = (url: string) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = () => {
            if (ctx) {
                const width = img.width;
                const height = img.height;
                const ratio = width / height;
                canvas.width = 300;
                canvas.height = 300 / ratio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                //redirect dataurl to new tab
                redirectToUrl(dataUrl);
                return dataUrl;
            }
        }
        return null;
    }

    useEffect(() => {

    }, [])



    return (
        <IonPage>
            <IonToolbar className="app-header">
                <IonButtons>
                    <IonButton slot="start">
                        <IonIcon icon={search}></IonIcon>
                    </IonButton>
                </IonButtons>
                    <IonAvatar onClick={()=>history.push("/profile")} className='dp-photo' slot="end">
                        <IonImg src={photo}></IonImg>
                    </IonAvatar>
            </IonToolbar>
            <IonContent fullscreen>
                <IonToolbar>
                    <IonTitle>Notifications</IonTitle>
                </IonToolbar>
                <IonList>
                    {
                        [1, 1, 1, 1, 1, 1].map((notif, index) => {
                            return (
                                <NotificationCard key={index}></NotificationCard>
                            )
                        })
                    }
                </IonList>

            </IonContent>
        </IonPage>
    );
};

export default Notifications;


const NotificationCard: React.FC = () => {
    return (
        <IonItem routerLink='/notifications/detail/1' button>
            <IonIcon icon={peopleOutline} slot="start"></IonIcon>
            <IonToolbar style={{ ['--background']: "transparent" }}>
                <IonLabel><b>Was this you </b> - Food purchase</IonLabel>
                <small>50,000 FCFA</small>
            </IonToolbar>
            <small slot="end">2:00 pm</small>
        </IonItem>
    )
}


function redirectToUrl(url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '__blank';
    a.click();
    document.removeChild(a);
}


 