import { Dialog } from '@capacitor/dialog'
import { IonAlert, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios'
import { chevronForward, imagesOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import { backendEndPoints } from '../components/Api_urls'
import { localImages } from '../components/images/images'
import { TemplateResponse } from '../components/interfaces/@api'
import { updateUser } from '../components/States/User-state'
import { UserStorage } from '../components/storageApi'
import { auth } from '../firebase'

const SignIn: React.FC = ({ }) => {

    //email state
    const [email, setEmail] = useState('')
    //password state
    const [password, setPassword] = useState('')
    //loading state
    const [loading, setLoading] = useState(false)

    //alert states
    const [alertMessage, setalertMessage] = useState('')
    const [alertHeader, setalertHeader] = useState('')

    //history
    const history = useHistory()
    
    const dispatch = useDispatch()

    useEffect(() => {

    }, [])

    //submitInfo function
    const submitInfo = async (ev: any) => {
        ev.preventDefault()

        setLoading(true)

        //sign in user with email password
        await auth.signInWithEmailAndPassword(email, password)
            .then(() => {
                return axios.post(backendEndPoints.user, {
                    email: email,
                })
                    .then(res => {
                        const data = res.data as TemplateResponse
                        if (data.status === 200) {
                           dispatch(updateUser({...data.data,photo:data.data.photo||localImages.profilePlaceholder}))
                            setalertHeader('Successful')
                            setalertMessage('You have successfully signed in')
                            setLoading(false)
                            //save user data locally
                            UserStorage.setUser(data.data)
                            history.push('/summary')

                        }
                        else {
                            alert(data.message)
                        }
                    }
                    )
                    .catch(err => {
                        setalertHeader('Login Error')
                        setalertMessage(err.message)
                    }
                    )
            }
            )
            .catch(err => {
                setalertHeader('Login Error')
                setalertMessage(err.message)
            }
            )

        setLoading(false)

    }

    //forgot password

    const forgotPassword = async (ev: any) => {
        ev.preventDefault()
        setLoading(true)

        const response = await Dialog.prompt({ title: "Email Required", message: "Please enter your email address" })

        if (response.value) {
            await auth.sendPasswordResetEmail(response.value)
                .then(() => {
                    setalertHeader('Reset Link Sent')
                    setalertMessage("Password reset email sent")
                }
                )
                .catch(err => {

                    setalertHeader('Password Reset Error')
                    setalertMessage(err.message)
                }
                )
        }
        setLoading(false)

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
                <IonAlert header={alertHeader} isOpen={!!alertMessage} message={alertMessage} buttons={['OK']} onDidDismiss={() => setalertMessage('')} />
                <IonLoading isOpen={loading} onDidDismiss={() => setLoading(false)} message="Please wait..." />
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
                                        <IonItem
                                            onClick={forgotPassword}
                                            lines="none" mode="md" button  >
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