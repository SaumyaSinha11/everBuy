import React from 'react'
import StockDec from './StockDec'
import {DirectOrder} from './DirectOrder'
import sendEmail from './SendEmail';



const ToBuy = (email,userId , productMap , productDetails , Aid) => {
    // StockDec(productMap);

    // DirectOrder(cid,aid,orders);
    sendEmail(productDetails,email);

}

export default ToBuy;