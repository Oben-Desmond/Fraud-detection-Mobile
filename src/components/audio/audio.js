import chime from "./chime.mp3"



export const localAudio={
    chime
}


const playAudio= ()=>{
    const audioElement= new Audio(chime)
    audioElement.type = 'audio/mp3';

    try{
        audioElement.play()
    }catch(err){
        console.log(err)
    }
}

export {playAudio}