import { IonContent, IonHeader, IonImg, IonPage, IonSpinner, IonToolbar } from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { compareFileImageWithImages, faceapi, faceDetectionError } from '../Ai/faceApi'

function FaceComparison() {
    const id_card = "https://pbs.twimg.com/media/Ep7pWynW8AAv3WJ.jpg"
    const other_images=[
        "https://pbs.twimg.com/media/FKx9oVxXMAoXM_V.jpg",
        "https://pbs.twimg.com/media/Ep7p69_WwAM417f.jpg"
    ]
    const [loading, setloading] = useState(false)
    const [image, setImage] = useState("");


    useEffect(() => {
        
         
    }, [])
    

    function selectFile(e:any){
        const file = e.target.files[0]
        compareFileImageWithImages( file,[id_card,...other_images]).then(res=>{
           console.log(res)
           
        }).catch((error:faceDetectionError)=>{
            
           if(error.match("no_face_detected1")){
               alert("invalid id card")
           }
              else if(error.match("no_face_detected2")){
                    alert("invalid picture(s)")
                }
                alert(error)
                console.log(error)
        })
    }


    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <h1>Face Comparison</h1>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <input type="file" name="" onChange={selectFile} id="" />
                  </IonContent>
        </IonPage>
    )
}

export default FaceComparison