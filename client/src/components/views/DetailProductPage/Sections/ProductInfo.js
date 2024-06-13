import React, { useEffect, useState } from 'react'
import { Button, Descriptions } from 'antd';
import { useHistory } from "react-router-dom";
import QuantityInput from '../../../utils/NumberInput';
import { useSelector } from "react-redux";

function ProductInfo(props) {
    const user = useSelector(state => state.user)
    const [Product, setProduct] = useState({})
    const [quantity, setQuantity] = useState(1)
    const [size, setSize] = useState('S')
    useEffect(() => {

        setProduct(props.detail)

    }, [props.detail])

    const addToCarthandler = () => {
        props.addToCart(props.detail._id, quantity, size)
    }

    const history = useHistory();

    const pushToLogin = () => {
        let path = `/login`; 
        history.push(path);
    }

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const onChangeQuantity = (value) => {
        setQuantity(value);
    }


    return (
        <div>
            <Descriptions title="Thông tin sản phẩm">
                <Descriptions.Item label="Giá tiền"> {addDotToNumber(Product.price ?? 0)}VNĐ</Descriptions.Item>
                <Descriptions.Item label="Đã mua">{Product.sold}</Descriptions.Item>
                <Descriptions.Item label="Đã xem"> {Product.views}</Descriptions.Item>
                <Descriptions.Item label="Mô tả"> {Product.description}</Descriptions.Item>
            </Descriptions>

            {user.userData && (user.userData.isAdmin || user.userData._id == props.detail.writer)
            ?
            <div />
            :
            <div>
                <br />
                <br />
                <div style={{alignItems:'center', justifyContent: 'center', flex: 1}}>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="middle" shape="default" type={size === 'S' ? "primary" : "default"}
                            onClick={() => setSize('S')}
                        >
                            S
                        </Button>
                    </div>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="middle" shape="default" type={size === 'M' ? "primary" : "default"}
                            onClick={() => setSize('M')}
                        >
                            M
                        </Button>
                    </div>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="middle" shape="default" type={size === 'L' ? "primary" : "default"}
                            onClick={() => setSize('L')}
                        >
                            L
                        </Button>
                    </div>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="middle" shape="default" type={size === 'XL' ? "primary" : "default"}
                            onClick={() => setSize('XL')}
                        >
                            XL
                        </Button>
                    </div>
                    <div style={{ display: 'inline-block', marginRight: '10px' }}>
                        <Button size="middle" shape="default" type={size === 'XXL' ? "primary" : "default"}
                            onClick={() => setSize('XXL')}
                        >
                            XXL
                        </Button>
                    </div>
                </div>
                
                <br />
                <QuantityInput value={quantity} onChange={onChangeQuantity}/>

                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {localStorage.userId
                        ?
                        <Button size="large" shape="round" type="danger"
                            onClick={addToCarthandler}
                        >
                            Thêm vào giỏ
                        </Button>
                        :
                        <Button size="large" shape="round" type="danger"
                            onClick={pushToLogin}
                        >
                            Thêm vào giỏ
                        </Button>
                    }
                </div>
            </div>
            }
        </div>
    )
}

export default ProductInfo
