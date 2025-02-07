import React from 'react'
import StockDec from './StockDec'
import {DirectOrder} from './DirectOrder'
import sendEmail from './SendEmail';



const ToBuy = (userId, email, productMap, productDetails, Aid) => {

    StockDec(productMap);
    sendEmail(productDetails,email);
    DirectOrder(userId,Aid,productMap);
}



export default ToBuy;