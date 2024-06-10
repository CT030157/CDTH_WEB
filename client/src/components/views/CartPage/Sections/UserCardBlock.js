import { InputNumber } from 'antd';
import React, { useEffect, useState } from 'react'


function UserCardBlock(props) {

    const renderCartImage = (images) => {
        if(images.length > 0) {
            let image = images[0]
            return image;
        }
    }

    const renderItems = () => (
        props.products && props.products.map(product => (
            <tr key={product._id}>
                <td>
                    <img style={{ width: '70px' }} alt="product" 
                    src={renderCartImage(product.images)} />
                </td> 
                <td>{product.quantity}</td>
                <td>{addDotToNumber(product.price ?? 0)}VNĐ </td>
                <td><button 
                onClick={()=> props.removeItem(product._id)}
                >Loại bỏ </button> </td>
            </tr>
        ))
    );

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá tiền</th>
                        <th>Loại bỏ</th>
                    </tr>
                </thead>
                <tbody>
                    {renderItems()}
                </tbody>
            </table>
        </div>
    )
}

export default UserCardBlock
