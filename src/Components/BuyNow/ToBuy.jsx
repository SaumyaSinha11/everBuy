import React from 'react'
import StockDec from './StockDec'

const ToBuy = (productId , quantity , userId) => {
    StockDec(productId , quantity);
}

export default ToBuy;