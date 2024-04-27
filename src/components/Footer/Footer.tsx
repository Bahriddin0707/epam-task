import React from 'react'
import { IoMdArrowDropleft, IoMdArrowDropright } from 'react-icons/io'

// Style
import './Footer.css'

interface Props {
  setCarsPerPage: React.Dispatch<React.SetStateAction<number>>
  carsPerPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  currentPage: number
  currentCars: any
}

const Footer = ({
  setCarsPerPage,
  carsPerPage,
  setCurrentPage,
  currentPage,
  currentCars,
}: Props) => {
  return (
    <footer>
      <div className="pagination">
        <select
          onChange={(e: { target: { value: string } }) =>
            setCarsPerPage(Number(e.target.value))
          }
          value={carsPerPage}
        >
          <option value="2">2</option>
          <option value="4">4</option>
          <option value="7">7</option>
          <option value="10">10</option>
        </select>
        <button
          onClick={() =>
            setCurrentPage((prev) => {
              if (prev === 1) return prev
              else return prev - 1
            })
          }
        >
          <IoMdArrowDropleft />
        </button>
        <span>Page {currentPage}</span>
        <button
          onClick={() =>
            setCurrentPage((prev) => {
              if (currentCars.length == 0) return prev
              else return prev + 1
            })
          }
        >
          <IoMdArrowDropright />
        </button>
      </div>
    </footer>
  )
}

export default Footer
