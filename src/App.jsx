import { Route, Switch, Redirect, useLocation, useHistory } from 'react-router-dom'
import { useState, useMemo, useEffect, useCallback } from 'react'
import { LoginPage, PillStorePage } from './pages'
import UserContext from './pages/components/UserContext'

const App = () => {
  //----------check path------------
  const location = useLocation()
  const isHomePath = location.pathname === "/home"
  const isPillStorePath  = location.pathname === "/pillstore"

  // this is global state that use useContext to pass all value to it's destination
  const [user, setUser] = useState({})  
  const [pillList, setPillList] = useState([])
  const [selectedPillStore, setSelectedPillStore] = useState({})
  const [isAuth, setIsAuth] = useState(()=>{
    let localAuth = localStorage.getItem("auth")
    return localAuth? JSON.parse(localAuth) : false
  })  // Authentication mockup
  const [center, setCenter] = useState({"lat": 15.039960, "lng": 100.178123}) // default lat,lng
  const [isSelect, setIsSelect] = useState(false)
  const [pillStoreList, setPillStoreList] = useState([])
  const [render, setRender] = useState(false)

  const API_KEY = process.env.REACT_APP_SERVER_URL
  const API_AUTH = process.env.REACT_APP_AUTH_RECEIPT
  const API_UPDATE = process.env.REACT_APP_UPDATE_RECEIPT
  const API_PILLSTORES = process.env.REACT_APP_GET_PILLSTORES

  const history = useHistory()

  const logout = useCallback(() => {
    console.log('Loging out...')

    localStorage.removeItem('prescriptionID')
    localStorage.removeItem('auth')
    console.log('Remove from LocalStorage Completed')
    
    console.log('set Auth false')
    setIsAuth(false)
    console.log('Logout Completed')
    history.push('/login')
  },[history])

  // aware of unnecessary change
  const passValue = useMemo(() => ({user, setUser, pillList, setPillList, selectedPillStore, setSelectedPillStore, isAuth, setIsAuth, center, setCenter, isSelect, setIsSelect, API_KEY, API_AUTH, API_UPDATE, API_PILLSTORES, pillStoreList, setPillStoreList, render, setRender, logout, history}), 
                                  [user, setUser, pillList, setPillList,selectedPillStore, setSelectedPillStore, isAuth, setIsAuth, center, setCenter, isSelect, setIsSelect, API_KEY, API_AUTH, API_UPDATE, API_PILLSTORES, pillStoreList, setPillStoreList, render, setRender, logout, history]) //( (valueHere), [if here has changed.. it gonna change valueHere])

  // Refresh page (At first time of press Refreshing in anypage or run the first time when login)
  useEffect(() => {
     // get locations data
    const fetchLocations = async (prescriptionID) => {
        const res = await fetch(API_KEY + API_PILLSTORES + prescriptionID, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        if (res.status === 200){
            const data = await res.json()
            setPillStoreList(data)
            
            console.log({PillStores : data})
            console.log("Fetch Location Completed")
        }else{
            console.log("ERROR:" + res.status + " Cannot get Avaliable pillStores")
        }
    
    } 

    // Begin useEffect Function 
    var localPrescriptionID = localStorage.getItem("prescriptionID")

    localStorage.setItem('auth', JSON.stringify(isAuth))

    setRender(false)  // always set to default false

    if (localPrescriptionID !== null) {
      localPrescriptionID = JSON.parse(localPrescriptionID)
      
      //Debug
      console.log("localPrescriptionID is "+ localPrescriptionID)
      // console.log({ identificationNumber: localNationalId, _id: localSerialNumber });
      fetchLocations(localPrescriptionID)
      .then(()=> {

        setRender(true)
      })

    }
    else{
      console.log("Not Found localStorage")
    }

  },[API_AUTH, API_KEY, API_PILLSTORES, isHomePath, isPillStorePath, isAuth])
  

  //get patient receipts user profile data  // NEED TO DELETE THIS SOON ... 
  //   useEffect(() => {
  //     const fetchUser = async (id) => {
  //         const res = await fetch(`http://localhost:5500/receipts/${id}`)
  //         const data = await res.json()

  //         setUser(data)
  //         setPillList(data.pills)
  //         setSelectedPillStore(data.pillStore)
  //         setCenter(data.pillStore.coordinate)
  //     }

  //     fetchUser("1101402227500") // set manually from mockup

  // },[])

  return (
    
      <UserContext.Provider value={passValue}>
      
      {isAuth?
        <Switch>
          <Route exact path="/pillstore" component={PillStorePage} />
          <Redirect to="/pillstore" />
        </Switch>
      : 
        <Switch>
          <Route exact path="/login" component={LoginPage} />
          <Redirect to="/login" />
        </Switch>
      }
        

        {/* <Switch>
          
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/pillstore" component={PillStorePage} />
            <Route exact path="/receipt" component={ReceiptPage} />
            <Redirect to="/login"/>

        </Switch> */}

      </UserContext.Provider>
    
  );
};

//<div className="flex w-full h-screen justify-center items-center text-6xl font-bold">PillPlus+ [Patient]</div>

export default App;
