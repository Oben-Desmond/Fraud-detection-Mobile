import { IonAvatar, IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonPage, IonProgressBar, IonRouterLink, IonRow, IonTitle, IonToolbar, useIonViewDidEnter } from '@ionic/react';
import { callOutline, logoWhatsapp, mailOutline, peopleOutline, search } from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import { convertAmount, photo } from './Summary';
import './Notifications.css';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { useSelector } from 'react-redux';
import { Transaction, User } from '../components/interfaces/@entities';
import { selectUser } from '../components/States/User-state';
import axios from 'axios';
import { backendEndPoints } from '../components/Api_urls';

const Notifications: React.FC = () => {

    const user: User = useSelector(selectUser)
    // transactions 
    const [transactions, settransactions] = useState<Transaction[]>([])
    // loading state
    const [loading, setloading] = useState<boolean>(false)

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

        if (user.email)
            getAnormal();

    }, [user])

    useIonViewDidEnter(()=>{
       getAnormal()
    })
    async function getAnormal() {
        setloading(true)
        await axios.post(backendEndPoints.anormal, { email: "obend678@gmail.com" })
            .then(res => {
                if (res.data.status == "200") {
                    settransactions([...res.data.data])

                }
                console.log(res.data.data)
            }).catch(err => alert(err))
        setloading(false)
    }



    return (
        <IonPage>
            <IonToolbar className="app-header">
                <IonButtons>
                    <IonButton slot="start">
                        <IonIcon icon={search}></IonIcon>
                    </IonButton>
                </IonButtons>
                <IonAvatar onClick={() => history.push("/profile")} className='dp-photo' slot="end">
                    <IonImg src={user.photo}></IonImg>
                </IonAvatar>
            </IonToolbar>
            {
                loading && <IonProgressBar type="indeterminate" color="primary"></IonProgressBar>
            }
            <IonContent fullscreen>

                <IonRow>
                    <IonCol></IonCol>
                    <IonCol size="12" sizeMd="6" sizeLg="5">
                        <IonToolbar>
                            <IonTitle>Notifications</IonTitle>
                        </IonToolbar>
                        <IonList>
                            {
                                transactions.map((notif, index) => {
                                    return (
                                        <NotificationCard notification={notif} key={index}></NotificationCard>
                                    )
                                })
                            }
                        </IonList>
                    </IonCol>
                    <IonCol></IonCol>
                </IonRow>

            </IonContent>
        </IonPage >
    );
};

export default Notifications;


const NotificationCard: React.FC<{ notification: Transaction }> = ({ notification }) => {

    const user: User = useSelector(selectUser)
    const amount = convertAmount(notification.amount);
    // name is name of other person
    const name = notification.sender_id == user.email ? notification.receiver_name : notification.sender_name;
    const photo = notification.sender_id == user.email ? notification.receiver_photo : notification.sender_photo;

    return (
        <IonItem className="ion-padding-top ion-text-capitalize" routerLink='/notifications/detail/1' button>
            <IonAvatar slot="start">
                <IonImg src={photo}></IonImg>
            </IonAvatar>
            <IonToolbar style={{ ['--background']: "transparent" }}>
                <IonLabel><b>{notification.type}</b> - {name}
                    <br />
                    <small style={{ color: "grey" }}> <i>{notification.ref}</i></small></IonLabel>
                <small>{amount} FCFA</small>
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


