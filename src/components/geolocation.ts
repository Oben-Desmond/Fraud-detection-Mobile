import { GeoLocationReadableData } from "./interfaces/@api";

  const API_KEY="7d18179936d94d0c8f8c207722735b16";

    //function gets user city from geocoords
    const getUserCity = (lng: number, lat: number) => {
        fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                //extract city from response
                const city = data.results[0].components.city;
                
                
            }
            )
    }
   
    const getMinGeolocationData= function (lng:number, lat:number):Promise<GeoLocationReadableData>{
        return fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${API_KEY}`)
            .then(res => res.json())
            .then(data => {
                //extract city from response
                const city = data.results[0].components.town;
                //get country
                const country = data.results[0].components.country;
                //get flag
                const flag = data.results[0].annotations.flag;
                //return data
                return {
                    lat,
                    lng,
                    city,
                    country,
                    flag
                }
            }
            )
    }



export {getMinGeolocationData};