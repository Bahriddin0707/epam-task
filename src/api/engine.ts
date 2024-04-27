import { axiosInstance } from './api'

export enum EngineStatus {
  START = 'started',
  STOP = 'stopped',
  DRIVE = 'drive',
}

export interface IEngine {
  velocity: number
  distance: number
}

export interface IEngineDrive {
  success: boolean
}

export const engineAPI = {
  async drive(id: number) {
    const res = await axiosInstance
      .patch<boolean>(`/engine/?id=${id}&status=${EngineStatus.DRIVE}`)
      .then((res) => res.data)
      .catch((err) => {
        if (err.res?.status !== 200) {
          console.error('car engine has broken down due to overheating')
          return false
        }
        throw new Error(err)
      })
    return res
  },
  async start(id: number) {
    const res = await axiosInstance
      .patch<IEngine>(`/engine/?id=${id}&status=${EngineStatus.START}`)
      .then((res) => res.data)
    return res
  },
  async stop(id: number) {
    const res = await axiosInstance
      .patch<IEngine>(`/engine/?id=${id}&status=${EngineStatus.STOP}`)
      .then((res) => res.data)
    return res
  },
}
