import React from 'react';

const BtnRedeem = (props) => {
    if(props.cost <= props.points){
        return <button className="btn btn-block btn-primary mt-2" onClick={props.onClick} >Canjear ahora</button>;
    }else{
        const dif = props.cost - props.points;
        return <button className="btn btn-block btn-primary mt-2" disabled>Te faltan {dif}pts</button>;
    }
}

export default BtnRedeem;