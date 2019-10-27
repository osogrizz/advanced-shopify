import React, { useContext } from 'react'
import { animated, useTransition } from 'react-spring'
import { StoreContext } from '../context/StoreContext'

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
              background: 'var(--xtraPurp)',
              ...props
            }}
          >
            Loading
          </animated.div> 
        )}
      </div>
    )
  ))
}

export default Loader
