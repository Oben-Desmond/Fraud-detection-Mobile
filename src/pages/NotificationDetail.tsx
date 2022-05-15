import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonLabel, IonList, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { chevronForward, closeOutline, happyOutline } from 'ionicons/icons'
import React, { useState } from 'react'
import { useHistory } from 'react-router'
import { photo } from './Summary'

const NotificationDetail: React.FC = () => {
    const [reported, setreported] = useState(false)

    const history = useHistory()

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton mode="ios"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Notification Detail</IonTitle>
                        <IonAvatar onClick={()=>history.push("/profile")} className='dp-photo' slot="end">
                            <IonImg src={photo}></IonImg>
                        </IonAvatar>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonToolbar style={{ padding: "13px" }} >
                    <div>
                        <IonCardTitle> Was This you</IonCardTitle>
                        <IonCardSubtitle>Suspicious Purchase</IonCardSubtitle>
                    </div>
                    <span slot='end'>2:00PM</span>
                </IonToolbar>
                <IonToolbar style={{ padding: "13px" }} >
                    {
                        [
                            { name: "Category", desc: "Transportation" },
                            { name: "Amount", desc: "5000 FCFA" },
                            { name: "Place", desc: "Buea" },
                            { name: "Time", desc: "2:30PM" },
                            { name: "Status", desc: "approved" },
                        ].map((notif, index) => {
                            return (<IonRow>
                                <IonCol>
                                    <IonLabel>{notif.name}</IonLabel>
                                </IonCol>
                                <IonCol>
                                    <IonCardSubtitle>{notif.desc}</IonCardSubtitle>
                                </IonCol>
                            </IonRow>)
                        })
                    }

                </IonToolbar>
                <br /><br /><br />
                <IonToolbar color="none" mode="ios" className="ion-text-center">
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol>
                            {!reported && <IonButtons style={{ margin: "auto" }}>
                                <IonButton color="dark" fill="solid">It was me <IonIcon color="success" icon={happyOutline} slot="end"></IonIcon> </IonButton>
                                <IonButton color='dark' fill="outline">Not Me <IonIcon color="danger" icon={closeOutline} slot="end"></IonIcon> </IonButton>
                            </IonButtons>}

                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>

                </IonToolbar>
                <IonToolbar color='none' mode='ios' className="ion-padding">
                    {<IonCard>
                        <IonCardHeader>
                            <h1>Potential Insecurity Issue</h1>
                        </IonCardHeader>
                        <IonCardContent>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quo ipsa, non accusantium dolore distinctio nam! Reprehenderit nisi consectetur ex.
                            <IonToolbar color="none">
                                <IonButtons slot="end">
                                    <IonButton color="danger" fill="solid">Report <IonIcon icon={chevronForward} /> </IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonCardContent>

                    </IonCard>}

                </IonToolbar >
            </IonContent>
        </IonPage>
    )
}

export default NotificationDetail
