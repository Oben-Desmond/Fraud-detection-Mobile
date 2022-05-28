import { IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonList, IonNote, IonPage, IonRouterLink, IonRow, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios'
import { chevronForward, closeOutline, happyOutline } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { backendEndPoints } from '../components/Api_urls'
import { playAudio } from '../components/audio/audio'
import { Reported, Transaction, User } from '../components/interfaces/@entities'
import { selectUser } from '../components/States/User-state'
import { photo } from './Summary'

const NotificationDetail: React.FC = () => {
    const user: User = useSelector(selectUser)


    // transaction state
    const [transaction, settransaction] = useState<Transaction>()
    const [reported, setreported] = useState<boolean>(false)
    const [reporting, setreporting] = useState<boolean>(false)
    // loading
    const [loading, setloading] = useState<boolean>(true)

    const history = useHistory()
    const contentRef = useRef<HTMLIonContentElement>(null)

    // useeffect get transaction history location
    useEffect(() => {
        if (!user) {
            history.push('/signin')
            return;
        }
        const transaction = history.location.state as Transaction
        if (transaction && transaction.amount) {
            settransaction(transaction)
            axios.post(backendEndPoints["get-reports"], { transaction_id: transaction.id || "" })
                .then((res) => {

                    console.log(res)
                    if (res.status == 200) {
                        setreported(true)
                    } else {
                        setreported(false)
                    }
                }).catch((err) => {
                    console.log(err)
                    setreported(false)
                })
        }

    }, [])

    useEffect(() => {
        if (user.email != transaction?.sender_id) {
            setreported(false)
        } else {
            setreported(true)
        }
        // get report with transaction_id if exists
        if (!transaction) {
            return
        }


    }, [])


    function reportIssue() {

        // submitting report to server
        setloading(true)
        setreported(true)
        if (!transaction || !user || !transaction.sender_id) {
            alert('no transaction info or user information')
            return
        }

        const newReport: Reported = {
            amount: transaction.amount,
            created_at: transaction.created_at,
            reported_at: Date.now(),
            reporter: transaction.sender_id,
            reported: transaction.receiver_id!,
            type: transaction.type,
            lng: transaction.lng,
            lat: transaction.lat,
            transaction_id: transaction.id || '',
        }
        axios.post(backendEndPoints.report, { ...newReport }).then(res => {
            if (res.status == 200) {
                alert("Successfully Reported")
                setreporting(false)
                playAudio()
            }

            setloading(false)
        }).catch(err => {
            alert(err)
            setloading(false)
        })


    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton mode="ios"></IonBackButton>
                    </IonButtons>
                    <IonTitle>Notification Detail</IonTitle>
                    <IonAvatar onClick={() => history.push("/profile")} className='dp-photo' slot="end">
                        <IonImg src={user.photo}></IonImg>
                    </IonAvatar>
                </IonToolbar>
            </IonHeader>
            <IonContent ref={contentRef}>
                <IonToolbar style={{ height: "13px" }} >
                </IonToolbar>

                <IonToolbar>
                    {/* google map iframe with longitutes and latitues of transactions represented  */}
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol size="12" sizeSm='10' sizeMd="6">
                            <IonButtons>
                                <IonAvatar>
                                    <IonImg src={transaction?.receiver_photo}></IonImg>
                                </IonAvatar>
                                <IonAvatar>
                                    <IonImg src={transaction?.sender_photo}></IonImg>
                                </IonAvatar>
                                <IonNote className="ion-text-capitalize">
                                    {transaction?.type}
                                </IonNote>
                            </IonButtons>
                            <IonToolbar style={{ padding: "13px" }} >

                                {
                                    [
                                        { name: "Category", desc: transaction?.category },
                                        { name: "Amount", desc: transaction?.amount },
                                        { name: "Month", desc: transaction?.month },
                                        { name: "Time", desc: (new Date(transaction?.created_at || 0)).toLocaleString() },
                                        { name: "sender", desc: transaction?.sender_name },
                                        { name: "receiver", desc: transaction?.receiver_name },
                                        { name: "Status", desc: "approved" },
                                    ].map((notif, index) => {
                                        return (
                                            <IonItem lines="none" color={index % 2 == 0 ? "light" : "none"}>

                                                <IonLabel>{notif.name}</IonLabel>

                                                <IonCardSubtitle slot="end">{notif.desc}</IonCardSubtitle>

                                            </IonItem>
                                        )
                                    })
                                }

                            </IonToolbar>
                            <iframe style={{ width: "100%", height: "70vh", border: "none" }} src={'https://maps.google.com/maps?q=' + transaction?.lat + ',' + transaction?.lng + '&t=&z=15&ie=UTF8&iwloc=&output=embed'} />
                            <br /><br /><br />
                            <IonToolbar color="none" mode="ios" className="ion-text-center">
                                <IonRow>
                                    <IonCol></IonCol>
                                    <IonCol>
                                        {!reported && <IonButtons style={{ margin: "auto" }}>
                                            <IonButton onClick={() => {setreported(true)}}  color="dark" fill="solid">It was me <IonIcon color="success" icon={happyOutline} slot="end"></IonIcon> </IonButton>
                                            <IonButton onClick={() => {setreporting(true); setreported(true); contentRef.current?.scrollToBottom(500)}}  color='dark' fill="outline">Not Me <IonIcon color="danger" icon={closeOutline} slot="end"></IonIcon> </IonButton>
                                        </IonButtons>}

                                    </IonCol>
                                    <IonCol></IonCol>
                                </IonRow>

                            </IonToolbar>

                            <IonToolbar color='none' mode='ios' className="ion-padding">
                                {reporting && <IonCard>
                                    <IonCardHeader>
                                        <h1>Potential Insecurity Issue</h1>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        If you are certain that this transaction was not performed by you and there is a security risk please Report so that it can be checked as fast as possible.
                                        This could be a potential security Issue
                                        <IonToolbar color="none">
                                            <IonButtons onClick={() => reportIssue()} slot="end">
                                                <IonButton color="danger" fill="solid">Report <IonIcon icon={chevronForward} /> </IonButton>
                                            </IonButtons>
                                        </IonToolbar>
                                    </IonCardContent>
                                </IonCard>}
                            </IonToolbar >
                        </IonCol>
                        <IonCol></IonCol>
                    </IonRow>
                </IonToolbar>


            </IonContent>
        </IonPage>
    )
}

export default NotificationDetail
