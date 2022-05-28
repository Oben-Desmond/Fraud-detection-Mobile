import { IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonRow, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from '@ionic/react'
import axios from 'axios'
import { clipboardOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { backendEndPoints } from '../components/Api_urls'
import { playAudio } from '../components/audio/audio'
import { localImages } from '../components/images/images'
import { Reported, Transaction, User } from '../components/interfaces/@entities'

const Admin: React.FC = () => {
    // tab state
    const [segment, setsegment] = useState<"users" | "transactions" | "reports" | "logout">('logout')
    // admin states
    const [users, setusers] = useState<User[]>([])
    const [transactions, settransactions] = useState<Transaction[]>([])
    const [reports, setreports] = useState<Reported[]>([])


    useEffect(() => {
        getAdminSummary()
    }, [])


    function getAdminSummary() {
        axios.post(backendEndPoints["get-admin-summary"])
            .then((res) => {
                const data = res.data.data
                console.log(res.data)
                if (res.status == 200) {
                    // extract user data from res.data.data
                    const users = data.users || [] as User[]
                    const reports = data.reports || [] as Reported[]
                    const transactions = data.transactions || [] as Transaction[]
                    setusers(users)
                    setreports(reports)
                    settransactions(transactions)

                }
            })
    }
    return (
        <IonPage>
            <IonToolbar>
                <IonRow>
                    <IonCol size="12" sizeMd="6" sizeLg="4" style={{ margin: 0, padding: 0 }}>
                        <IonToolbar>
                            <IonTitle>Admin Dashboard</IonTitle>
                        </IonToolbar>
                    </IonCol>
                    <IonCol style={{ margin: 0, padding: 0 }} size="12" sizeMd="6" sizeLg="4" >
                        {segment != "logout" && <IonItem lines="none">
                            <IonSegment value={segment} onIonChange={(e: any) => setsegment(e.detail.value!)}>
                                <IonSegmentButton value="users" style={{ fontSize: "14px" }}  >
                                    Users
                                </IonSegmentButton>

                                <IonSegmentButton value="reports" style={{ fontSize: "14px" }} >
                                    Reports
                                </IonSegmentButton>

                                <IonSegmentButton value="transactions" style={{ fontSize: "14px" }} >
                                    transactions
                                </IonSegmentButton>

                                <IonSegmentButton value="logout" style={{ fontSize: "14px" }} >
                                    Logout
                                </IonSegmentButton>
                            </IonSegment>
                        </IonItem>}

                    </IonCol>
                </IonRow>
            </IonToolbar>
            <IonContent>
                {segment == "users" && <UserSummary users={users} />}
                {segment == "transactions" && <TransacionSummary transactions={transactions} />}
                {segment == "reports" && <ReportSummary reports={reports} />}
                {segment == "logout" && <Logout loginSuccess={() => { setsegment("users") }} />}

            </IonContent>
        </IonPage>
    )
}

export default Admin


const UserSummary: React.FC<{ users: User[] }> = ({ users }) => {


    return (
        <IonList>
            <IonListHeader>
                <IonTitle>User Summary</IonTitle>
            </IonListHeader>
            {
                users.map((user, index) => {
                    return (
                        <div style={{  background: index%2==0?"var(--ion-color-light)":"" }} key={index}>
                            <IonRow>
                                <IonCol size="12" sizeMd="2">
                                    <img style={{ width: "60px", margin: "auto" }} src={user.photo || localImages.profilePlaceholder} alt="user" />
                                </IonCol>
                                <IonCol className="ion-align-self-center" sizeSm="12" sizeMd="8">
                                    <IonRow>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="4" >
                                            <div style={{ fontSize: "14px" }}>{user.name}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{user.email}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" sizeSm="1" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{user.phone}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{(new Date(user.created_at)).toTimeString()}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2" >
                                            <div style={{ fontSize: "14px" }}>{user.city}</div >
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </div>
                    )
                })
            }
        </IonList>
    )
}









const ReportSummary: React.FC<{ reports: Reported[] }> = ({ reports }) => {
    const report: Reported = {
        amount: 700,
        created_at: Date.now(),
        reported_at: Date.now(),
        reporter: 'obend678@gmail.com',
        reported: 'kerry@gmail.com',
        type: 'withdrawal',
        lng: '2.5',
        lat: '8.45',
        transaction_id: '8'
    }


    return (
        <IonList>
            <IonListHeader>
                <IonTitle>Reports</IonTitle>
            </IonListHeader>
            {
                reports.map((report, index) => {
                    return (
                        <div style={{  background: index%2==0?"var(--ion-color-light)":"" }} key={index}>
                            <IonRow>
                                <IonCol className="ion-align-self-center ion-text-center" size="12" sizeMd="2">
                                    <IonIcon icon={clipboardOutline} size="large"></IonIcon>
                                </IonCol>
                                <IonCol className="ion-align-self-center" sizeSm="12" sizeMd="8">
                                    <IonRow>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="4" >
                                            <div style={{ fontSize: "14px" }}>{report.reported}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{report.reporter}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" sizeSm="1" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{report.amount}FCFA</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>
                                                <IonBadge color="warning">on</IonBadge>
                                                {(new Date(report.reported_at)).toLocaleDateString()}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2" >
                                            <div style={{ fontSize: "14px" }}>{report.transaction_id}</div >
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </div>
                    )
                })
            }
        </IonList>
    )
}






const TransacionSummary: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {



    return (
        <IonList>
            <IonListHeader>
                <IonTitle>Transactions</IonTitle>
            </IonListHeader>
            <IonRow>
                <IonCol className="ion-align-self-center ion-text-center" size="12" sizeMd="2">
                   <div>Profile</div>
                </IonCol>
                <IonCol className="ion-align-self-center" sizeSm="12" sizeMd="8">
                    <IonRow>
                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="4" >
                            <div style={{ fontSize: "14px" }}>Receiver </div >
                        </IonCol>
                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                            <div style={{ fontSize: "14px" }}>Sender</div >
                        </IonCol>
                        <IonCol className="ion-align-self-center" sizeSm="1" sizeMd="2">
                            <div style={{ fontSize: "14px" }}>Amount</div >
                        </IonCol>
                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                            <div style={{ fontSize: "14px" }}>
                                <IonBadge color="warning">on</IonBadge>
                                Date</div >
                        </IonCol>
                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2" >
                            <div style={{ fontSize: "14px" }}>Reference</div >
                        </IonCol>
                    </IonRow>
                </IonCol>
            </IonRow>
            {
                transactions.map((report, index) => {
                    return (
                        <div style={{  background: index%2==0?"var(--ion-color-light)":"" }} key={index}>
                            <IonRow>
                                <IonCol className="ion-align-self-center ion-text-center" size="12" sizeMd="2">
                                    <IonIcon icon={clipboardOutline} size="large"></IonIcon>
                                </IonCol>
                                <IonCol className="ion-align-self-center" sizeSm="12" sizeMd="8">
                                    <IonRow>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="4" >
                                            <div style={{ fontSize: "14px" }}>{report.receiver_id}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{report.sender_id}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" sizeSm="1" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>{report.amount}FCFA</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2">
                                            <div style={{ fontSize: "14px" }}>
                                                <IonBadge color="warning">on</IonBadge>
                                                {(new Date(report.created_at)).toLocaleDateString()}</div >
                                        </IonCol>
                                        <IonCol className="ion-align-self-center" size="12" sizeSm="2" sizeMd="2" >
                                            <div style={{ fontSize: "14px" }}>{report.ref}</div >
                                        </IonCol>
                                    </IonRow>
                                </IonCol>
                            </IonRow>
                        </div>
                    )
                })
            }
        </IonList>
    )
}




const Logout: React.FC<{ loginSuccess: () => void }> = ({ loginSuccess }) => {
    const report: Reported = {
        amount: 700,
        created_at: Date.now(),
        reported_at: Date.now(),
        reporter: 'obend678@gmail.com',
        reported: 'kerry@gmail.com',
        type: 'withdrawal',
        lng: '2.5',
        lat: '8.45',
        transaction_id: '8'
    }
    const [reports, setreports] = useState<Reported[]>([
        report, report, report
    ])
    // user name and password states
    const [userName, setuserName] = useState<string>('')
    const [password, setpassword] = useState<string>('')

    // submitt info function
    const submitInfo = (e: any) => {
        e.preventDefault()
        console.log(userName, password)
        if (userName === 'admin' && password === 'atem1234') {
            console.log('login success')
            playAudio()
            alert('login success')
            loginSuccess()

        } else {
            console.log('login failed')
            alert('login failed wrong password or Email')
        }
    }


    return (
        <IonList>

            <IonRow>
                <IonCol></IonCol>
                <IonCol size="12" sizeSm="10" sizeMd="6" sizeLg='5'>
                    <IonListHeader>
                        <IonItem lines="none">
                            <IonCardTitle>
                                Sign In to Admin
                            </IonCardTitle>
                        </IonItem>
                    </IonListHeader>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ flex: "1" }}></div>
                        <div style={{ flex: "1" }}>
                            <form onSubmit={submitInfo}>
                                <IonCard>
                                    <IonCardHeader>
                                        <IonCardTitle>Login</IonCardTitle>
                                    </IonCardHeader>
                                    <IonCardContent>
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Email</IonLabel>
                                            <IonInput required value={userName} onIonChange={(e) => setuserName(e.detail.value!)}></IonInput>
                                        </IonItem>
                                        <br />
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Password</IonLabel>
                                            <IonInput required value={password} onIonChange={(e) => setpassword(e.detail.value!)} type="password"></IonInput>
                                        </IonItem>
                                        <br />
                                        <IonToolbar>
                                            <IonButton type="submit" fill="solid" color="dark">Login</IonButton>
                                        </IonToolbar>
                                    </IonCardContent>
                                </IonCard>
                            </form>
                        </div>
                        <div style={{ flex: "1" }}></div>
                    </div>
                </IonCol>
                <IonCol></IonCol>
            </IonRow>

        </IonList>
    )
}