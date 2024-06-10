import React, { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty } from 'antd';
import Axios from 'axios';
import Paypal from '../../utils/Paypal';
import { Button } from 'antd';
function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [TotalUSD, setTotalUSD] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)

    useEffect(() => {

        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                });
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then((response) => {
                        if (response.payload.length > 0) {
                            calculateTotal(response.payload)
                        }
                    })
            }
        }

    }, [dispatch, props.user.userData])

    const calculateTotal = (cartDetail) => {
        let total = 0;
        let totalUSD = 0;
        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity;
            totalUSD = Number.parseFloat(totalUSD =total/22).toFixed(2)
        });
        
        setTotal(total)
        setTotalUSD(totalUSD)
        setShowTotal(true)
    }


    const removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then((response) => {
                if (response.payload.cartDetail.length <= 0) {
                    setShowTotal(false)
                } else {
                    calculateTotal(response.payload.cartDetail)
                }
            })
    }

    const transactionSuccess = (data) => {
        dispatch(onSuccessBuy({
            cartDetail: props.user.cartDetail,
            paymentData: data
        }))
            .then(response => {
                if (response.payload.success) {
                    setShowSuccess(true)
                    setShowTotal(false)
                }
            })
    }

    const transactionError = () => {
        console.log('Paypal error')
    }

    const transactionCanceled = () => {
        console.log('Transaction canceled')
    }

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }


    return (
        <div style={{ width: '85%', margin: '3rem auto' }}>
            <h1>Giỏ hàng</h1>
            <div>

                <UserCardBlock
                    products={props.user.cartDetail}
                    removeItem={removeFromCart}
                />


                {ShowTotal ?
                    <div style={{ marginTop: '3rem' }}>
                        <h2>Thanh toán: {addDotToNumber(Total ?? 0)}VNĐ = {TotalUSD}USD </h2>
                    </div>
                    :
                    ShowSuccess ?
                        <Result
                            status="success"
                            title="Successfully Purchased Items"
                        /> :
                        <div style={{
                            width: '100%', display: 'flex', flexDirection: 'column',
                            justifyContent: 'center'
                        }}>
                            <br />
                            <Empty description={false} />
                            <p>Không có sản phẩm trong giỏ hàng</p>

                        </div>
                }
            </div>




            {ShowTotal &&

                // <Paypal
                //     toPay={TotalUSD}
                //     onSuccess={transactionSuccess}
                //     transactionError={transactionError}
                //     transactionCanceled={transactionCanceled}
                // />
                <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} onClick={() => transactionSuccess('ok')}>
                    Thanh toán
                </Button>

            }



        </div>
    )
}

export default CartPage
