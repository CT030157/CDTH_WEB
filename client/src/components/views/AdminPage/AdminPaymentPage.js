import React,{ useState , useEffect} from 'react'
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import { USER_SERVER } from '../../Config';

function AdminPaymentPage(props) {
    const [Payments, setPayments] = useState([])


    const getPayments= () => {
        Axios.get(`${USER_SERVER}/admin/payments`)
            .then(response => {
                if (response.data.success) {
                    setPayments(response.data.payments)
                } else {
                    alert('Lỗi lấy dữ liệu')
                }
            })
    }

    const calculateTotal = (products) => {
        let total = 0;

        products.map(item => {
            total += parseInt(item.price, 10) * item.quantity;
        });
        
        return addDotToNumber(total);
    }

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    const history = useHistory();
  
    const routeChange = (id) =>{ 
        let path = `/admin/product/${id}`; 
        history.push(path);
    }

    useEffect(() => {
        getPayments()
    }, [])
    
    const renderCards = Payments.map((payment, index) => {
        return(
            <tr key={payment._id}>
                <td>{index+1}</td> 
                <td>{payment._id}</td> 
                <td>{payment.product.map((product) => {
                    return (
                        <div onClick={() => routeChange(product.product_id)}>
                            {product.name} {product.size != null ? `cỡ ${product.size}` : ''}
                        </div>
                    )
                    })}</td> 
                <td>{payment.product.map((product) => {
                    return (
                        <div>
                            {product.quantity}
                        </div>
                    )
                    })}</td>
                <td>{calculateTotal(payment.product)} VNĐ</td>
                <td>{payment.user[0].name}</td>
                <td>Số điện thoại: {payment.phone}
                    <br />
                    Địa chỉ: {payment.address}
                </td>
                <td>{payment.product[0].status}</td>
            </tr>   
        )
    })


    return (
        <div style={{width: '75%' , margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' , padding : '20px' }}>
                <h1>Danh sách hóa đơn</h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã hóa đơn</th>
                        <th>Mặt hàng</th>
                        <th>Số lượng</th>
                        <th>Tổng tiền</th>
                        <th>Người mua</th>
                        <th>Thông tin</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default AdminPaymentPage