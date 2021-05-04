import { useState, useContext} from 'react';
import Button from '../components/Button'
import UserContext from '../components/UserContext'

const LoginPage = () => {

    const [prescriptionID, setPrescriptionID] = useState('') //

    const {setPillStoreList, setRender, setIsAuth, API_KEY, API_PILLSTORES} = useContext(UserContext)

    const [error, setError] = useState(false) // default is false (* when error you need to setError for error to display on screen)

    const submitHandler = async (event) => {
        event.preventDefault();

        // get locations data
        const fetchLocations = async (prescriptionID) => {
            // console.log(API_KEY + API_PILLSTORES + prescriptionID)
            const res = await fetch(API_KEY + API_PILLSTORES + prescriptionID, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(res.status)
            
            if (res.status === 200){
                const data = await res.json()
                setPillStoreList(data)
                
                localStorage.setItem('prescriptionID', JSON.stringify(prescriptionID))
                console.log({PillStores : data})
                console.log({openingData : data.openingData})
                console.log("Fetch Location Completed")
            }else{
                console.log("ERROR:" + res.status + " Cannot get Avaliable pillStores")
            }

        }
       
        fetchLocations(prescriptionID)
        .then(() => setRender(true))
        .then(() => {
            setIsAuth(true);
        })
    }

    return (
        
        <div className="flex justify-center items-center w-screen h-screen">
            <div className="flex flex-col justify-center items-center w-11/12 py-8 sm:py-16 sm:max-w-lg  bg-white rounded-lg shadow-md">
                <form className="flex flex-col items-center w-9/12" onSubmit={submitHandler} autoComplete="off">
                    
                    <p className="text-3xl text-center mt-5 mb-2">ร้านขายยาที่สามารถไปรับยาได้</p>

                    {error ?  // error display here  
                    <div className="flex flex-row flex-wrap justify-center h-11 sm:h-7 text-red-600" >
                        <h2> ไม่พบข้อมูลในระบบทะเบียน </h2>
                        <h2> กรุณาตรวจสอบอีกครั้ง </h2>
                    </div> : <div className="h-11 sm:h-7" ></div> }

                    {/* National ID  */}
                    <input
                        className="mt-1 self-stretch p-2 pl-4 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none"
                        type="text"
                        value={prescriptionID}
                        onChange={(event) => {
                            setPrescriptionID(event.target.value);
                        }}
                        placeholder="เลขที่ใบสั่งยา"
                        required
                    />
                    {/* Serial Number  */}
                    
                    <Button
                        title='ยืนยัน'
                        type='summit'
                        className='mt-6 self-stretch'
                        //onClick={() => history.push('/home')}  //bypass shortcut
                    />

                    
                </form>
            </div>
        </div>
    )
}

export default LoginPage
