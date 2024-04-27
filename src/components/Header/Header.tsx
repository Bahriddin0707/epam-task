import { Dispatch, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { Container } from 'react-bootstrap'

// STYLE
import './Header.css'

interface Props {
  setRace: Dispatch<SetStateAction<boolean>>
  setPopUp: Dispatch<SetStateAction<boolean>>
}

const Header = ({ setRace, setPopUp }: Props) => {
  const stopRace = () => {
    setRace(false)
    setPopUp(false)
  }

  return (
    <Container>
      <div className="header">
        <button>
          <Link to={'/'} onClick={stopRace}>
            garage
          </Link>
        </button>
        <button>
          <Link to={'/winners'} onClick={stopRace}>
            winners
          </Link>
        </button>
      </div>
    </Container>
  )
}

export default Header
