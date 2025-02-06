import React from 'react'
import StockDec from './StockDec'
import DirectOrder from './DirectOrder'



const ToBuy = (productId , quantity, cid, aid, orders) => {

    StockDec(productId , quantity);

    DirectOrder(cid,aid,orders);

}

export default ToBuy;