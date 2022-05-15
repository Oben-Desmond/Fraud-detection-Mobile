import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios'
import { chevronForward, imagesOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { backendEndPoints } from '../components/Api_urls'

const SignIn: React.FC = ({ }) => {

    //email state
    const [email, setEmail] = useState('')
    //password state
    const [password, setPassword] = useState('')



    useEffect(() => {

    }, [])

    //submitInfo function
    const submitInfo = (ev: any) => {
        ev.preventDefault()
        fetch(backendEndPoints.sign_in, {
            method:"POST",
            mode:"cors",
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({ email, password })
        }).
            then(res => {
                console.log(res.status)
            }).catch(error => {
                console.log(error)
            })

    }
    return (
        <IonPage>
            <IonToolbar mode="ios">
                <IonTitle>SignIn</IonTitle>
                <IonButtons slot="end">
                    <IonButton
                        routerLink="/sign-up"
                    >Sign Up
                        <IonIcon slot="end" icon={chevronForward}></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <br />
                <br />
                <br />
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol size="12" sizeSm='10' sizeMd='8'>
                            <form onSubmit={submitInfo}>
                                <IonCard mode="ios">
                                    <IonCardHeader>
                                        <h5>Please Provide info required</h5>
                                    </IonCardHeader>
                                    <IonCardContent className="auth-content" mode="md">
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Email</IonLabel>
                                            <IonInput
                                                value={email} onIonChange={(e) => setEmail(e.detail.value!)} required
                                                type="email"></IonInput>
                                        </IonItem>
                                        <IonItem fill="outline">
                                            <IonLabel position="floating">Password</IonLabel>
                                            <IonInput
                                                value={password} onIonChange={(e) => setPassword(e.detail.value!)} required
                                                type="password"></IonInput>
                                        </IonItem>
                                        <IonItem lines="none" mode="md" button  >
                                            <IonLabel slot="end">Forgot Password</IonLabel>
                                        </IonItem>
                                        <IonToolbar className="ion-text-center">
                                            <IonButton type="submit" fill="solid" color="primary">Sign Up</IonButton>
                                        </IonToolbar>
                                    </IonCardContent>
                                </IonCard>
                            </form>
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>
                </IonGrid>
            </IonContent>
        </IonPage>
    )
}


export default SignIn