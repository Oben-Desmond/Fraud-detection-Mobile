import { IonAvatar, IonBackButton, IonButton, IonButtons, IonChip, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import { calendarOutline, callOutline, cameraOutline, chevronForward, personOutline } from 'ionicons/icons'
import React from 'react'
import { useHistory } from 'react-router'
import { photo } from './Summary'

const Profile: React.FC = () => {
    // editing state
    const [editing, setEditing] = React.useState(false)
       
     const history = useHistory()

    //log out user
    const logoutUser=()=>{
        history.push("/sign-in")
    }
    return (
        <IonPage>
            <IonToolbar style={{ padding: "0 13px" }}>
                <IonButtons slot="start">
                    <IonBackButton mode="ios"></IonBackButton>
                </IonButtons>
                <IonTitle>Profile</IonTitle>
                <IonButtons onClick={logoutUser} slot="end" >
                    <IonButton fill="solid" mode="ios" color="primary" >Logout <IonIcon icon={chevronForward}></IonIcon></IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol className="ion-self-align-center">
                            <IonAvatar style={{ margin: "auto", width: "100px", height: "100px", position: "relative" }}>
                                <IonImg src={photo}></IonImg>
                            </IonAvatar>
                            <IonChip color="primary" className="ion-text-center" style={{ position: "absolute", bottom: "0px", right: "0" }} >
                                <IonIcon icon={cameraOutline}></IonIcon>
                            </IonChip>
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>
                    <IonToolbar>
                        <IonButtons slot="end">
                            {!editing && <IonButton mode="ios" onClick={() => setEditing(true)} color="primary" ><u>Edit</u></IonButton>}
                        </IonButtons>
                    </IonToolbar>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol size="8">
                            {!editing && <div>
                                <IonToolbar>
                                    <IonIcon color="medium" size="large" className='ion-margin-end' icon={personOutline} slot="start"></IonIcon>
                                    <IonLabel>Atemafack Tendem</IonLabel>
                                </IonToolbar>
                                <IonToolbar>
                                    <IonIcon color="medium" size="large" className='ion-margin-end' icon={calendarOutline} slot="start"></IonIcon>
                                    <IonLabel>BirthDay</IonLabel>
                                </IonToolbar>
                                <IonToolbar>
                                    <IonIcon color="medium" size="large" className='ion-margin-end' icon={callOutline} slot="start"></IonIcon>
                                    <IonLabel>+237 677 266 898</IonLabel>
                                </IonToolbar>

                            </div>}
                            {editing && <div>
                                <IonToolbar>
                                    <IonItem fill="outline">
                                        <IonLabel position="floating">Email</IonLabel>
                                        <IonInput value="Atemafack Tendem" />
                                    </IonItem>
                                    <br />
                                    <IonItem fill="outline">
                                        <IonLabel position="floating">Birthday</IonLabel>
                                        <IonInput type="date" value="BirthDay" />
                                    </IonItem>
                                    <br />
                                    <IonItem fill="outline">
                                        <IonLabel position="floating">Telephone</IonLabel>
                                        <IonInput value="+237 677 266 898" />
                                    </IonItem>
                                </IonToolbar>
                                <br />
                                <IonToolbar>
                                <IonButton slot="start" mode="ios" onClick={() => setEditing(false)} fill="solid" color="light" ><u>Cancel</u></IonButton>
                                <IonButton slot="end" mode="ios" onClick={() => setEditing(false)} fill="solid" color="success" ><u>Save</u></IonButton>
                                </IonToolbar>
                            </div>}
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}

export default Profile