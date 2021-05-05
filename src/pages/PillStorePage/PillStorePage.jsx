import React, { useState, useContext, useCallback, useEffect } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import MapPage from '../MapPage/MapPage';
import PillStoreList from './components/PillStoreList';
import FilterBarPillStore from './components/FilterBarPillStore';
import MapContext from '../components/MapContext';
import UserContext from '../components/UserContext';

const PillStorePage = () => {
    const {
        user,
        setUser,
        setPillList,
        selectedPillStore,
        setSelectedPillStore,
        center,
        setCenter,
        isSelect,
        setIsSelect,
        pillStoreList,
        render,
        logout,
        API_KEY,
        API_UPDATE,
        API_PILLSTORES,
        setPillStoreList,
        setRender,
        setIsAuth,
        history,
    } = useContext(UserContext);

    const [filter, setFilter] = useState(''); //filter string
    const [access, setAccess] = useState(true); //checkbox
    const [tempSelected, setTempSelected] = useState(selectedPillStore);

    const stringDataOpening = () => {
        return tempSelected.openingData
            .map((value) => {
                let string = '';

                string += '<p><b>';
                string += String(value.day) + ': ';
                if (value.opening) {
                    string +=
                        String(value.openHour) + ':' + String(value.openMinute) + '-' + String(value.closeHour) + ':' + String(value.closeMinute);
                } else {
                    string += 'ปิด';
                }
                string += '</b></p>';

                return string;
            })
            .join('');
    };

    useEffect(() => {
        const fetchLocations = async (prescriptionID) => {
            const res = await fetch(API_KEY + API_PILLSTORES + prescriptionID, {
                method: 'GET',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(res.message);
            console.log(res);

            if (res.status === 200) {
                const data = await res.json();
                setPillStoreList(data);

                localStorage.setItem('prescriptionID', JSON.stringify(prescriptionID));
                console.log({ PillStores: data });
                console.log({ openingData: data.openingData });
                console.log('Fetch Location Completed');
            } else {
                console.log('ERROR:' + res.status + ' Cannot get Avaliable pillStores');
                return false;
            }
            return true;
        };

        const interval = setInterval(() => {
            fetchLocations(user.prescriptionID).then((res) => {
                if (res) {
                    setRender(true);
                    setIsAuth(true);
                }
            });
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex flex-col justify-start items-center w-screen h-screen">
            <Header
                title="PILLPLUS+"
                className="py-2 sm:py-4"
                onClick={() => {
                    logout();
                }}
                onBackpage={() => {
                    history.push('/home');
                }}
            />
            <h1 className="mb-3 text-gray-900 text-lg sm:text-2xl inline-block sm:hidden">เปลี่ยนสถานที่รับยา</h1>

            <div className="flex flex-col xl:flex-row justify-start items-center xl:items-start w-full h-full">
                {render && (
                    <>
                        <MapContext.Provider
                            value={{
                                selectedPillStore,
                                setCenter,
                                center,
                                setIsSelect,
                                setSelectedPillStore,
                                access,
                                pillStoreList,
                                tempSelected,
                                setTempSelected,
                            }}
                        >
                            <MapPage />
                        </MapContext.Provider>

                        {/* large filter and pillStoreList and done button */}
                        <div className="flex flex-col justify-start items-center w-10/12 sm:p-5 mt-2 sm:mt-0 sm:h-full ">
                            <h1 className="my-2 text-gray-800 text-lg sm:text-2xl hidden sm:inline-block">สถานที่รับยา</h1>

                            <FilterBarPillStore
                                className="mt-1 sm:mt-0 my-0.5 w-995/1000 z-40"
                                description="ค้นหา..." // ชื่อร้าน, ที่อยู่
                                onChange={(event) => {
                                    setFilter(event.target.value); //change filter string
                                }}
                                onCheck={() => {
                                    setAccess(!access); //change checkbox
                                }}
                                value={filter} //filter string
                                access={access} //checkbox
                            />

                            <MapContext.Provider
                                value={{ setIsSelect, selectedPillStore, setSelectedPillStore, setCenter, center, tempSelected, setTempSelected }}
                            >
                                <div className="flex flex-col justify-start items-center overflow-y-auto h-full w-full max-h-44 sm:max-h-128 divide-y border-l-0 border-r-0 bg-gray-200 z-30 rounded-b-lg">
                                    <PillStoreList
                                        pillStoreList={pillStoreList}
                                        selectedPillStore={selectedPillStore}
                                        filter={filter} //filter string
                                        access={access} //checkbox
                                    />
                                </div>
                            </MapContext.Provider>

                            {/* <Button 
                                title=''
                                className={`rounded-t-none rounded-sm  w-full h-11 disabled:opacity-50 ${!isSelect ? "pointer-events-none":" " }`}
                                disabled={!isSelect} // make it true for default (disable = true at first time)
                            /> */}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default PillStorePage;
