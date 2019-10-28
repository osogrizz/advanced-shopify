import React, { useContext } from 'react'
import { StoreContext } from '../context/StoreContext'
import { animated, useTransition } from 'react-spring'

import Spinner from '../images/three-dots.svg'

const Loader = () => {

  const { isLoading } = useContext(StoreContext)

  const transitions = useTransition(isLoading, null, {
    from: {transform: 'translate3d(100%, 0, 0)', opacity: 0 },
    enter: {transform: 'translate3d(0, 0, 0)', opacity: 0.8 },
    leave: {transform: 'translate3d(100%, 0, 0)', opacity: 0 }
  })

  return transitions.map(({ item, key, props }) => (
    item && (
      <div>
        {isLoading && (
          <animated.div 
            key={key}
            style={{
              position: 'fixed',
              zIndex: 1000,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--xtraPurp)',
              ...props
            }}
          >
            <img src={Spinner} alt="loading"/>
          </animated.div> 
        )}
      </div>
    )
  ))
}

export default Loader
