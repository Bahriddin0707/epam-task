import React from 'react'
import { IoClose } from 'react-icons/io5'

type PropsTypes = {
  setpopup: (value: boolean) => void
  name: string
  time: string
}

const WinnerPopUp: React.FC<PropsTypes> = ({ setpopup, name, time }) => {
  return (
    <div className="winner-popup">
      <div className="pop-up">
        <div className="content">
          <button onClick={() => setpopup(false)}>
            <IoClose />
          </button>
          <h1>winner</h1>
          <div className="car">
            <span>{name}</span>
            <br />
            <span>
              time: {time}
              <small>s</small>
            </span>
          </div>
        </div>
        <img src="/border.png" alt="" />
      </div>
    </div>
  )
}

export default WinnerPopUp
