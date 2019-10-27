import React, { useContext, useState } from 'react'
import { StoreContext } from '../../context/StoreContext'
import { animated } from 'react-spring'

const Cart = ({ style }) => {
  const { 
    isCartOpen, 
    checkout, 
    toggleCartOpen, 
    removeProductFromCart, 
    checkCoupon, 
    removeCoupon 
  } = useContext(StoreContext)

  const [coupon, setCoupon] = useState('')

  return (
    <animated.div style={
      {
         position: 'fixed',
         zIndex: 100,
         top: 0,
         right: 0,
         width: '50%',
         height: '100%',
         background: '#fff',
         boxShadow: 'var(--elevation-2)',
         padding: '40px 2%',
         ...style,
      }}
    >
      <button  
        style={{ background: 'var(--red)', 
                 position: 'absolute', 
                 top: 20, 
                 right: 20 
              }} 
        className="delete is-large" 
        onClick={toggleCartOpen}
      >
        Close Cart
      </button>
        <h3 className="title">Cart</h3>
        {checkout.lineItems.map( item => (
          <div key={item.id} style={{ display: 'flex', marginBottom: '2rem' }}>
            <div style={{ width: 100, height: 100, overflow: 'hidden', marginRight: 10 }}>
              <img src={item.variant.image.src} alt={item.title} />
            </div>
            <div>
              <h4 className="title is-4">{item.title}</h4>
              <p className="subtitle is-5">${item.variant.price}</p>
              <p className="subtitle is-5" >Qty: {item.quantity}</p>
              <button 
                className="is-small button is-danger is-outlined" 
                onClick={() => removeProductFromCart(item.id)} 
              >
                Remove
              </button>
            </div>
          </div>  
        ))}
        <div>
          {checkout.discountApplications.length > 0 
          ? (
            <div>
              Coupon: 
              <h5 className="title">
                {checkout.discountApplications[0].code} - {' '}
                {checkout.discountApplications[0].value.percentage}% off
              </h5>
              <button  
                className="is-small button is-danger is-outlined" 
                onClick={(e) => {removeCoupon(coupon)}}
              > 
                Remove Coupon
              </button>
            </div>
          )
          : (
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                checkCoupon(coupon)
              }}
            >
              <div className="field">
                <label htmlFor="coupon" className="label">
                  Coupon
                  <input 
                    className="input"
                    type="text"
                    value={coupon} 
                    onChange={(e) => {setCoupon(e.target.value)}} 
                  />   
                </label>
                <button className="button" >Add Coupon</button>
              </div>
            </form>
          )
          }
        </div>
        <hr/>
        <h2>Total: </h2>
        <h5>${checkout.totalPrice}</h5>
        <div style={{ marginTop: '2rem' }}>
          <a href={checkout.webUrl} className="button is-fullwidth is-success">Checkout Now</a>
        </div>
    </animated.div>
  )
}

export default Cart
