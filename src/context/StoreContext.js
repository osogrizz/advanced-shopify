import React, { createContext, useState, useEffect } from 'react'
import Client from 'shopify-buy'


const client = Client.buildClient({
  domain: 'levelut-store.myshopify.com',
  storefrontAccessToken: '547f70676efed95e93d9a0e9f9722451'
})

const defaultValues = {
  isCartOpen: false,
  toggleCartOpen: () => {},
  checkCoupon: () => {},
  cart: [],
  addProductToCart: () => {
    console.log('added!')
  },
  client,
  checkout: {
    lineItems: [],
  }, 
}

export const StoreContext = createContext(defaultValues)

const isBrowser = typeof window !== undefined

export const StoreProvider = ({ children }) => {

  const [checkout, setCheckout] = useState(defaultValues.checkout)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const toggleCartOpen = () => {
    setIsCartOpen(!isCartOpen)
  }

  useEffect(() => {
    initializeCheckout()
  }, [checkout])

  const getNewId = async () => {
    try {
      const newCheckout = await client.checkout.create()
      if (isBrowser) {
        localStorage.setItem('checkout_id', newCheckout.id)
      }
      return newCheckout
    } catch (error) {
      console.error(error)
    }
  }

  const initializeCheckout = async () => {
    try {

      // Check if it's a Browser

      // Check if it exist
      const currentCheckoutId = isBrowser 
        ? localStorage.getItem('checkout_id')
        : null

      let newCheckout = null

      if (currentCheckoutId) {
        // if id exist. fetch checkout from Shopify
        newCheckout = await client.checkout.fetch(currentCheckoutId)
        if (newCheckout.completedAt) {
          newCheckout = await getNewId()
        }
      } else {
        // If id does not exist create a new checkout
        newCheckout = await getNewId()
      }
      
      // Set checkout to state
      setCheckout(newCheckout)

    }
    catch (error) {
      console.log(error)
    }
  }

  const addProductToCart = async (variantId) => {
    try {
      setIsLoading(true)
      const lineItems = [
        {
          variantId,
          quantity: 1
        },
      ]
      const addItems = await client.checkout.addLineItems(
        checkout.id,
        lineItems
      )
      // Buy Now button code
      // window.open(addItems.webUrl, '_blank')
      console.log(addItems.webUrl)
    }
    catch(error) {
      console.log(error)
    }
    setIsLoading(false)
    console.log('!')
  }

  const removeProductFromCart = async (lineItemId) => {
    try {
      setIsLoading(true)
      console.log(lineItemId)
      // const addItems = await client.checkout.addLineItems(
      //   checkout.id,
      //   lineItems
      // )
      // Buy Now button code
      // window.open(addItems.webUrl, '_blank')

      const newCheckout = await client.checkout.removeLineItems( 
        checkout.id,
        [lineItemId]
      )
      setCheckout(newCheckout)
      setIsLoading(false)
    }
    catch(error) {
      console.log(error)
    }
  }

  const checkCoupon = async (coupon) => {
    setIsLoading(false)
    const newCheckout = await client.checkout.addDiscount(checkout.id, coupon)
    setCheckout(newCheckout)
    setIsLoading(false)
    
  }

  const removeCoupon = async (coupon) => {
    setIsLoading(true)
    const newCheckout = await client.checkout.removeDiscount(checkout.id, coupon)
    setCheckout(newCheckout)
    setIsLoading(false)
  }

  return (
    <StoreContext.Provider value={
        {...defaultValues,
          checkout,
          addProductToCart,
          toggleCartOpen,
          isCartOpen,
          removeProductFromCart,
          checkCoupon,
          removeCoupon,
          isLoading,
        }
      }
    >
      {children}
    </StoreContext.Provider>
  )
}