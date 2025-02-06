import React from 'react'
import StockDec from './StockDec'

const ToBuy = (productId, quantity, userId, addressId) => {
    StockDec(productId , quantity);
}

export default ToBuy;