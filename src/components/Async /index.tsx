import { useEffect, useState } from 'react'

export function Async() {
  const [isButtonVisible, setIsButtonVisible] = useState(false)
  const [isButtonInvisible, setIsButtonInvisible] = useState(false)

  useEffect(() => {
    setTimeout(()  => {
      setIsButtonVisible(true)      
    }, 1000)
  }, [])

  useEffect(() => {
    setTimeout(()  => {
        setIsButtonInvisible(true)
    }, 1500)
  }, [])

  return (
    <div>
      <div>Hello World</div>
      {!isButtonInvisible && <button type="button">Invisible Button</button>}
      {isButtonVisible && <button type="button">Hidden Button</button>}
    </div>
  )
}