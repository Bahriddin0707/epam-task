import './styles/App.css'
import './styles/mobile.css'
import { useState } from 'react'
import Car from './components/Car'
import { createCar, getGarage, updateCar } from './api/api'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { carBrands } from './utils/carBrands'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Winners from './components/Winners/Winners'
import WinnerPopUp from './components/Winners/WinnerPopUp'
import Loader from './components/Loader/Loader'
import Header from './components/Header/Header'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer/Footer'

interface Car {
  id: number
  name: string
  color: string
}

export interface IFastestTime {
  time: number
  name: string
}

interface ICarResponse {
  name: string
  color: string
}

export default function App() {
  const [race, setRace] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const [changeColor, setChangeColor] = useState<string>('')
  const queryClient = useQueryClient()
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [carsPerPage, setCarsPerPage] = useState<number>(7)
  const [getTimes, setGetTimes] = useState<IFastestTime[]>([])
  const [popUp, setPopUp] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  const { data, isLoading } = useQuery({
    queryKey: ['garage'],
    queryFn: getGarage,
  })

  const createCarMutation = useMutation({
    mutationFn: createCar,
    onMutate: (data) => {
      const previousData = queryClient.getQueryData<ICarResponse[]>('garage')
      queryClient.setQueryData<ICarResponse[]>('garage', (prevData) => {
        return prevData ? [...prevData, data] : [data]
      })
      return () => queryClient.setQueryData('garage', previousData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('garage')
    },
  })

  const updateCarMutation = useMutation({
    mutationFn: updateCar,
    onSuccess: () => {
      queryClient.invalidateQueries('garage')
    },
  })

  const [selectedId, setSelectedId] = useState<number>(0)
  const [updateValue, setUpdateValue] = useState<string>('')
  const [updateColor, setUpdateColor] = useState<string>('')

  const updateCarData = () => {
    if (updateValue != '') {
      updateCarMutation.mutate({
        id: selectedId,
        name: updateValue,
        color: updateColor,
      })
      setUpdateValue('')
      setUpdateColor('')
    } else alert('Fill the input')
  }

  const addCar = () => {
    if (inputValue != '') {
      createCarMutation.mutate({
        name: inputValue.toLowerCase(),
        color: changeColor,
      })
      setInputValue('')
      setChangeColor('')
    } else alert('Fill the input')
  }

  const generateCar = () => {
    for (let i = 0; i < 10; i++) {
      const car = {
        name: carBrands[Math.floor(Math.random() * carBrands?.length)],
        color: `#${Math.floor(Math.random() * 999999)}`,
      }
      createCarMutation.mutate(car)
    }
  }

  const lastCarIndex = currentPage * carsPerPage
  const firstCarIndex = lastCarIndex - carsPerPage
  const currentCars = data?.slice(firstCarIndex, lastCarIndex) ?? []
  const fastestTime = getTimes.sort(
    (a: IFastestTime, b: IFastestTime) => a.time - b.time,
  )

  return (
    <>
      {race && popUp ? (
        <WinnerPopUp
          name={fastestTime[0]?.name}
          time={String(fastestTime[0]?.time)}
          setpopup={setPopUp}
        />
      ) : null}

      <BrowserRouter>
        <Header setRace={setRace} setPopUp={setPopUp} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                {loading || isLoading ? (
                  <Loader />
                ) : (
                  <Container>
                    <div className="controls">
                      {data?.length === 0 ? null : (
                        <div className="btn">
                          <button
                            className={`${race ? 'inactive' : ''}`}
                            onClick={() => setRace(true)}
                          >
                            race
                          </button>
                          <button
                            className={`${!race ? 'inactive' : ''}`}
                            onClick={() => setRace(false)}
                          >
                            reset
                          </button>
                        </div>
                      )}
                      <div className="input">
                        <input
                          type="text"
                          placeholder="type car brand..."
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                        />
                        <input
                          type="color"
                          value={changeColor}
                          onChange={(e) => setChangeColor(e.target.value)}
                        />
                        <button onClick={addCar}>create</button>
                      </div>
                      <div className="input">
                        <input
                          type="text"
                          placeholder="type car brand..."
                          value={updateValue}
                          onChange={(e) => setUpdateValue(e.target.value)}
                        />
                        <input
                          type="color"
                          onChange={(e) => setUpdateColor(e.target.value)}
                          value={updateColor}
                        />
                        <button onClick={updateCarData}>update</button>
                      </div>
                      <div className="btn">
                        <button onClick={generateCar}>generate cars</button>
                      </div>
                    </div>

                    <div className="cars-quantity">
                      <span>garage {`(${data.length})`}</span>
                    </div>

                    <div className="road-arrow"></div>

                    <div className="road-wrapper">
                      {currentCars?.length === 0 ? (
                        <h1
                          className="empty-text"
                          style={{
                            color: '#fff',
                            fontSize: 50,
                            textAlign: 'center',
                          }}
                        >
                          there are no cars
                        </h1>
                      ) : (
                        <>
                          <div className="point-line"></div>
                          {currentCars.map(({ color, name, id }: Car) => (
                            <Car
                              key={id}
                              width={110}
                              height={110}
                              color={color}
                              name={name}
                              race={race}
                              id={id}
                              setselectedid={setSelectedId}
                              setupdatevalue={setUpdateValue}
                              setupdatecolor={setUpdateColor}
                              setgettimes={setGetTimes}
                              gettimes={getTimes}
                              setpopup={setPopUp}
                              popup={popUp}
                              setloading={setLoading}
                            />
                          ))}
                          <div className="point-line finish"></div>
                        </>
                      )}
                    </div>
                    <div className="road-arrow"></div>

                    <Footer
                      setCarsPerPage={setCarsPerPage}
                      carsPerPage={carsPerPage}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                      currentCars={currentCars}
                    />
                  </Container>
                )}
              </>
            }
          />
          <Route path={'/winners'} element={<Winners />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
