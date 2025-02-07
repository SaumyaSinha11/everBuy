import React from 'react'
import StockDec from './StockDec'
import {DirectOrder} from './DirectOrder'



const ToBuy  = (userId,email,productMap,productDetails, Aid) => {
//     StockDec(productId , quantity);
   console.log("TO buy");
    DirectOrder(userId,Aid,productMap);
}

export default ToBuy;