import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
})

const getGarage = async () => {
  try {
    const res = await axiosInstance.get('/garage').then((res) => res.data)
    return res
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.log(err.message)
    }
  }
}

const createCar = async ({ name, color }: { name: string; color: string }) => {
  const res = await axiosInstance
    .post('/garage', {
      name,
      color,
    })
    .then((res) => res.data)
  return res
}

const deleteCar = async (id: number) => {
  const res = await axiosInstance
    .delete(`/garage/${id}`)
    .then((res) => res.data)
  return res
}

const updateCar = async ({
  id,
  name,
  color,
}: {
  id: number
  name: string
  color: string
}) => {
  const res = await axiosInstance
    .put(`/garage/${id}`, { name, color })
    .then((res) => res.data)
  return res
}

const getWinners = async () => {
  const res = await axiosInstance.get('/winners').then((res) => res.data)
  return res
}

const getWinner = async (id: number) => {
  const res = await axiosInstance.get(`/winners/${id}`).then((res) => res.data)
  return res
}

const updateWinner = async ({
  id,
  time,
  wins,
  name,
  color,
}: {
  id: number
  time: string
  name: string
  color: string
  wins: number
}) => {
  const res = await axiosInstance
    .put(`/winners/${id}`, { name, color, time, wins })
    .then((res) => res.data)
  return res
}

const addWinners = async ({
  name,
  color,
  time,
  wins,
}: {
  name: string
  color: string
  time: string
  wins: number
}) => {
  const res = await axiosInstance
    .post('/winners', {
      name,
      color,
      wins,
      time,
    })
    .then((res) => res.data)
  return res
}

const deleteWinner = async (id: number) => {
  const res = await axiosInstance
    .delete(`/winners/${id}`)
    .then((res) => res.data)
  return res
}

export {
  axiosInstance,
  getGarage,
  createCar,
  deleteCar,
  updateCar,
  getWinners,
  addWinners,
  getWinner,
  updateWinner,
  deleteWinner,
}
