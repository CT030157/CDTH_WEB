import React, { useEffect, useState, } from 'react'
import { useDispatch } from 'react-redux';
import {
    getCartItems,
    removeCartItem,
    onSuccessBuy
} from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Result, Empty, Form, Input, Button } from 'antd';
import Axios from 'axios';
import Paypal from '../../utils/Paypal';
import { Formik } from 'formik';
import * as Yup from 'yup';
function CartPage(props) {
    const dispatch = useDispatch();
    const [Total, setTotal] = useState(0)
    const [TotalUSD, setTotalUSD] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')

    useEffect(() => {

        let cartItems = [];
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.product_id)
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
            paymentData: data,
            phone: phone,
            address: address,
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
                        <Formik
                            initialValues={{
                                phone: '',
                                address: '',
                            }}
                            validationSchema={Yup.object().shape({
                                phone: Yup.string()
                                .required('Yêu cầu nhập số điện thoại'),
                                address: Yup.string()
                                .required('Yêu cầu nhập dịa chỉ'),
                            })}
                            >
                            {props => {
                                const {
                                values,
                                touched,
                                errors,
                                handleChange,
                                handleBlur,
                                } = props;
                                return (
                                <div>
                                    <Form style={{ minWidth: '100px' }} >

                                    <Form.Item required label="Số điện thoại">
                                        <Input
                                        id="phone"
                                        placeholder="Nhập số điện thoại"
                                        type="text"
                                        value={values.phone}
                                        onChange={(e) =>{handleChange(e); setPhone(e.target.value)}}
                                        onBlur={handleBlur}
                                        />
                                        {errors.phone && touched.phone && (
                                        <div className="input-feedback">{errors.phone}</div>
                                        )}
                                    </Form.Item>

                                    <Form.Item required label="Địa chỉ">
                                        <Input
                                        id="address"
                                        placeholder="Nhập địa chỉ"
                                        type="text"
                                        value={values.address}
                                        onChange={(e) =>{handleChange(e); setAddress(e.target.value)}}
                                        onBlur={handleBlur}
                                        />
                                        {errors.address && touched.address && (
                                        <div className="input-feedback">{errors.address}</div>
                                        )}
                                    </Form.Item>
                                    </Form>
                                </div>
                                );
                            }}
                        </Formik>
                        {/* <h2>Thanh toán: {addDotToNumber(Total ?? 0)}VNĐ = {TotalUSD}USD </h2> */}
                        <h2>Thanh toán: {addDotToNumber(Total ?? 0)}VNĐ</h2>
                    </div>
                    :
                    ShowSuccess ?
                        <Result
                            status="success"
                            title="Mua hàng thành công"
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




            {ShowTotal ?

                // <Paypal
                //     toPay={TotalUSD}
                //     onSuccess={transactionSuccess}
                //     transactionError={transactionError}
                //     transactionCanceled={transactionCanceled}
                // />
                phone.trim() != '' && address.trim() != ''
                ?
                <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} 
                    onClick={() => transactionSuccess('ok')}
                    >
                    Thanh toán
                </Button>
                :
                <Button type="ghost" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} 
                    >
                    Thanh toán
                </Button>
                :
                <div />
            }



        </div>
    )
}

export default CartPage
