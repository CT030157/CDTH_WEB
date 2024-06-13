import React,{ useState , useEffect} from 'react'
import Axios from 'axios';
import { Button } from 'antd';
import { PRODUCT_SERVER, USER_SERVER } from '../../Config';
function PendingPage(props) {
    const [Payments, setPayments] = useState([])
    const [ProductIds, setProductIds] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()


    const getProducts = (variables) => {
        Axios.post(`${PRODUCT_SERVER}/getWriter`, variables)
            .then(response => {
                if (response.data.success) {
                    let products = response.data.products;
                    let productIds = products.map(item => item._id);
                    setProductIds(productIds);
                    Axios.post(`${USER_SERVER}/getPending`, {productIds: productIds}).then(response => {setPayments(response.data.payment)});
                } else {
                    alert('Lỗi lấy dữ liệu sản phẩm')
                }
            })
    }

    const changePending = (userId, paymentId, historyIdsUpdate, newStatus) =>{
        const variables = {
            userId: userId,
            paymentId: paymentId,
            historyIdsUpdate: historyIdsUpdate,
            newStatus: newStatus,
        }

        Axios.post(`${USER_SERVER}/changePending`, variables)
            .then(response => {
                if (response.status == 200) {
                    Axios.post(`${USER_SERVER}/getPending`, ProductIds).then(response => {setPayments(response.data.payment)});
                } else {
                    alert('Lỗi lấy dữ liệu sản phẩm')
                }
            })
    }

    useEffect(() => {
        const variables = {
            searchWrite : localStorage.userId,
            skip: Skip,
            limit: Limit,
        }
        getProducts(variables)
    }, [])

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    const renderCards = Payments.map((payment, index) => {
        let products = payment.product.filter(item => ProductIds.includes(item.product_id));
        return(
            <tr key={payment._id}>
                <td>{products.map((product) => {
                    return (
                        <div>
                            {product.name} {product.size != null ? `cỡ ${product.size}` : ''}
                        </div>
                    )
                    })}</td> 
                <td>{payment.user[0].name}</td>
                <td>{products.map((product) => {
                    return (
                        <div>
                            {product.quantity}
                        </div>
                    )
                    })}</td>
                <td>Số điện thoại: {payment.phone}
                    <br />
                    Địa chỉ: {payment.address}
                </td>
                <td>{products[0] ? products[0].status : ''}</td>
                <td>
                    {products[0] && products[0].status == 'Chờ duyệt'
                    ?
                    <div>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <Button size="middle" shape="default" style={{backgroundColor: 'green', color: 'white'}}
                                onClick={() => changePending(payment.user[0].id, payment._id, products.map(item => item.id), 'Đã duyệt')}
                            >
                                Duyệt
                            </Button>
                        </div>
                        <div style={{ display: 'inline-block', marginRight: '10px' }}>
                            <Button size="middle" shape="default" style={{backgroundColor: 'red', color: 'white'}}
                                onClick={() => changePending(payment.user[0].id, payment._id, products.map(item => item.id), 'Đã hủy')}
                            >
                                Hủy
                            </Button>
                        </div>
                    </div>
                    :
                    <div />
                    }
                </td>
            </tr>   
        )
    })


    return (
        <div style={{width: '75%' , margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' , padding : '20px' }}>
                <h1> Danh sách đơn hàng </h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Người mua</th>
                        <th>Số lượng</th>
                        <th>Thông tin</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default PendingPage