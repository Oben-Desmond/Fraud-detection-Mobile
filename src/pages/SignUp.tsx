import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonLabel, IonLoading, IonModal, IonPage, IonRow, IonTitle, IonToast, IonToolbar, useIonViewDidEnter } from '@ionic/react'
import { cameraOutline, chevronBack, chevronForward, imagesOutline } from 'ionicons/icons'
import React, { useEffect, useRef, useState } from 'react'
import { User } from '../components/interfaces/@entities'
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera"
import { Device } from "@capacitor/device";
import axios from "axios";
import { backendEndPoints } from '../components/Api_urls'
import { SignUpResponse } from '../components/interfaces/@api'
import { useHistory } from 'react-router'
import { faceapi } from '../Ai/faceApi';
import FaceComparison from './FaceComparison'
import { Dialog } from "@capacitor/dialog";


const initialUser: User = {
    email: 'obend678@gmail.com',
    password: 'desmond1234',
    city: '',
    country: '',
    lat: "",
    lng: "",
    name: 'Oben Desmond',
    phone: '678320028',
    created_at: Date.now(),
    photo: "",
    id_front: "",
    id_back: ""
}



const SignUp: React.FC = ({ }) => {

    //user state
    const [user, setUser] = useState<User>({ ...initialUser })
    //confirmed password state
    const [confirmedPassword, setConfirmedPassword] = useState<string>("")
    const [photo, setPhoto] = useState<string>("")
    const [loading, setloading] = useState<boolean>(false)

    //front and back Id_Image states
    const [frontId, setFrontId] = useState<string>("")
    const [frontFile, setFrontFile] = useState<File>()
    const [backId, setBackId] = useState<string>("")

    //webcam state
    const [showWebcam, setshowWebcam] = useState<boolean>(false)

    const [toastMessage, settoastMessage] = useState("")

    const history = useHistory();

    async function faceApiVerifyIdFront(file: File) {
        const image = await faceapi.bufferToImage(file) as HTMLImageElement
        const detection = await faceapi.detectSingleFace(image).withFaceLandmarks().withFaceDescriptor()
        if (!detection) {
            Dialog.alert({ message: "Please take a valid photo of your front ID", title: "Invalid id" })
            return false;
        }
        console.log("detection", detection)
        return true
    }

    //submit credentials
    const submitInfo = (ev: any) => {
        ev.preventDefault()
        if (user.password !== confirmedPassword) {
            Dialog.alert({ message:"Passwords do not match", title:"Password Mismatch"})
            return
        }
        if(!backId){
            Dialog.alert({ message: "Please upload your back ID", title:"Invalid id"})
            return
        }
        if (!frontFile) {
            alert("upload front of id card to continue")
        } else {
            setshowWebcam(true)
        }


    }

    async function submitUserData(distance: number) {

        if (distance > 0.48) {
            Dialog.alert({ message: "Facial recognition does not match that of Id card", title: "Invalid id" })
            return
        }
        
        settoastMessage("Your Face matches Id Card");
    
        setloading(true)
        await axios.post(backendEndPoints.sign_up, user).then(res => {
            const responseData: SignUpResponse = res.data
            if (responseData.status == 200) {
                history.push("/summary")
            }
            alert(responseData.message)
        }).catch(console.log)

        setloading(false)
    }


    return (
        <IonPage>
            <IonToolbar mode="ios">
                <IonTitle>SignUp</IonTitle>
                <IonButtons slot="end">
                    <IonButton
                        routerLink="/sign-in"
                    >Sign In
                        <IonIcon slot="end" icon={chevronForward}></IonIcon>
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent>
                <IonToast duration={1500} onDidDismiss={()=>settoastMessage("")} message={toastMessage} isOpen={!!toastMessage}></IonToast>
                <br />
                <br />
                <br />
                <IonGrid>
                    <IonRow>
                        <IonCol></IonCol>
                        <IonCol size="12" sizeSm='10' sizeMd='8'>
                            <IonLoading isOpen={loading} onDidDismiss={() => setloading(false)} message="Please Wait ..."></IonLoading>
                            {/* sign up form */}
                            <form onSubmit={submitInfo}>
                                <IonCard mode="ios">
                                    <IonCardHeader>
                                        <h5>Please Provide you info</h5>
                                    </IonCardHeader>
                                    <IonCardContent className="auth-content" mode="md">
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Full Names</IonLabel>
                                            <IonInput
                                                required value={user.name} onIonChange={(e) => setUser({ ...user, name: e.detail.value || "" })}
                                                type="text"></IonInput>
                                        </IonItem>
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Email</IonLabel>
                                            <IonInput
                                                required value={user.email} onIonChange={(e) => setUser({ ...user, email: e.detail.value || "" })}
                                                type="email"></IonInput>
                                        </IonItem>
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Telephone</IonLabel>
                                            <IonInput
                                                required value={user.phone} onIonChange={(e) => setUser({ ...user, phone: e.detail.value || "" })}
                                                type="tel"></IonInput>
                                        </IonItem>
                                        <IonItem onClick={() => { openImagePicker(setFrontId, setFrontFile, faceApiVerifyIdFront); }} lines="none" mode="md" button fill="outline" className='ion-padding-top' >
                                            <IonLabel>ID Card Front</IonLabel>
                                            {frontId ? <IonImg slot="end" style={{ height: "50px" }} src={frontId} /> : <IonIcon icon={imagesOutline} slot="end" />}
                                        </IonItem>
                                        <IonItem onClick={() => { openImagePicker(setBackId, () => { }) }} lines="none" mode="md" button fill="outline" className='ion-padding-top' >
                                            <IonLabel>ID Card Back</IonLabel>
                                            {backId ? <IonImg slot="end" style={{ height: "50px" }} src={backId} /> : <IonIcon icon={imagesOutline} slot="end" />}
                                        </IonItem>
                                        <IonItem fill="outline">
                                            <IonLabel position="floating">Password</IonLabel>
                                            <IonInput
                                                required value={user.password} onIonChange={(e) => setUser({ ...user, password: e.detail.value || "" })}
                                                type="password"></IonInput>
                                        </IonItem>
                                        <IonItem fill="outline" >
                                            <IonLabel position="floating">Confirm Password</IonLabel>
                                            <IonInput required
                                                value={confirmedPassword} onIonChange={(e) => setConfirmedPassword(e.detail.value || "")}
                                                type="password"></IonInput>
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
                    {frontFile && <CameraModal isOpen={showWebcam} onDidDismiss={(distance) => { setshowWebcam(false); distance!=null && submitUserData(distance) }}
                        frontId={frontFile}
                    ></CameraModal>}

                </IonGrid>
                {/* <div>
                    <div style={{ textAlign: 'center', padding: '10px' }}>
                        {
                            captureVideo && modelsLoaded ?
                                <button onClick={closeWebcam} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                                    Close Webcam
                                </button>
                                :
                                <button onClick={startVideo} style={{ cursor: 'pointer', backgroundColor: 'green', color: 'white', padding: '15px', fontSize: '25px', border: 'none', borderRadius: '10px' }}>
                                    Open Webcam
                                </button>
                        }
                    </div>
                    {
                        captureVideo ?
                            modelsLoaded ?
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'center', padding: '10px' }}>
                                        <video ref={videoRef} height={videoHeight} width={videoWidth} onPlay={handleVideoOnPlay} style={{ borderRadius: '10px' }} />
                                        <canvas ref={canvasRef} style={{ position: 'absolute' }} />
                                    </div>
                                </div>
                                :
                                <div>loading...</div>
                            :
                            <>
                            </>
                    }
                </div> */}
            </IonContent>
        </IonPage>
    )
}


export default SignUp


// open image picker
const openImagePicker = (callBack: (result: string) => void, callBack2: (result: File) => void, faceapiDetect = async (file: File) => true) => {

    const picker = document.createElement('input')
    picker.type = 'file'
    picker.accept = 'image/*'

    //add onchange listener to picker
    picker.addEventListener('change', (e: any) => {
        const file = e?.target?.files[0]
        const reader = new FileReader()
        reader.onloadend = async () => {
            if (reader.result && typeof reader.result === "string") {
                const val = await faceapiDetect(file)
                if (val) callBack(reader.result);
            }
        }

        if (file) callBack2(file)
        reader.readAsDataURL(file)
    })


    picker.click()

}



async function GetCameraPhoto(vidRef: React.RefObject<HTMLVideoElement>, CaptureButton: React.RefObject<HTMLIonFabButtonElement>, frontId: File, callBack: (distance: number) => void): Promise<string> {

    const loadingEl = document.createElement("ion-loading")
    loadingEl.message = "Please wait..."
    document.body.appendChild(loadingEl)


    const info = await Device.getInfo()
    if (!vidRef.current) {
        alert("no vid ref")
        return ""
    }
    if (info.platform == 'web') {
        // capature image from webcam
        //request camera permissions
        return new Promise<string>((resolve, reject) => {
            //get media devices stream
            navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            }).then(stream => {
                //create video element

                vidRef.current!.srcObject = stream
                const video = new MediaSource()
                vidRef.current!.muted = true

                //create canvas element
                const canvas = document.createElement('canvas')
                const context = canvas.getContext('2d')
                //set canvas size
                canvas.width = vidRef.current!.width
                canvas.height = vidRef.current!.height
                if (!context) return; //no context
                CaptureButton.current?.addEventListener('click', async () => {
                    loadingEl.present()

                    //capture image
                    context.drawImage(vidRef.current!, 0, 0, canvas.width, canvas.height)

                    const detection = await faceapi.detectSingleFace(vidRef.current!).withFaceLandmarks().withFaceDescriptor()
                    if (detection) {
                        const faceDescriptor = detection.descriptor
                        const frontIdImage = await faceapi.bufferToImage(frontId)
                        const fronimageDescriptor = (await faceapi.detectSingleFace(frontIdImage).withFaceLandmarks().withFaceDescriptor())?.descriptor ?? []
                        if (fronimageDescriptor.length > 0) {
                            //find distance between front image id and captured image id
                            const distance = faceapi.euclideanDistance(faceDescriptor, fronimageDescriptor)
                            callBack(distance)

                        }
                       
                    }
                    else{
                       Dialog.alert({ message: "No face detected",title:"Facial Recognition Error"})
                        callBack(1);
                    }

                    stream.getTracks().forEach(track => track.stop())
                    loadingEl.dismiss()

                })
            })
        })

    }
    else {
        return Camera.getPhoto({
            quality: 100,
            allowEditing: false,
            resultType: CameraResultType.Base64,
            source: CameraSource.Camera,
        }).then(res => {
            return res.base64String || ""
        })
    }
}


const CameraModal: React.FC<{ isOpen: boolean, onDidDismiss: (distance: number | null) => void, frontId: File }> = ({ isOpen, onDidDismiss, frontId }) => {

    const vidRef = useRef(null)
    const captureBtn = useRef<HTMLIonFabButtonElement>(null)

    const intializeCamera = function () {
        const value = GetCameraPhoto(vidRef, captureBtn, frontId, (d) => onDidDismiss(d))
        value.then(res => {
            console.log(res)
        })
    }

    function closeCameraModal() {
        onDidDismiss(null)
    }


    return (
        <IonModal onDidDismiss={() => onDidDismiss(null)} isOpen={isOpen} onDidPresent={() => { intializeCamera() }} >

            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton onClick={() => onDidDismiss(null)}>
                            <IonIcon icon={chevronBack}></IonIcon>
                            <IonLabel>Cancel</IonLabel>
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent scrollY={false} style={{ ["--background"]: "black", }}>
                <video autoPlay ref={vidRef} style={{ height: "93vh", width: "100%", objectFit: "cover" }}></video>
            </IonContent>
            <IonFab vertical='bottom' horizontal='center' >
                <IonFabButton ref={captureBtn} style={{ margin: "20px" }}>
                    <IonIcon icon={cameraOutline}></IonIcon>
                </IonFabButton>
            </IonFab>
        </IonModal>
    )
}