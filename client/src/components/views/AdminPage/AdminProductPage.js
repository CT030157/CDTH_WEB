import React,{ useState , useEffect} from 'react'
import Axios from 'axios';
import { useHistory } from "react-router-dom";
import { USER_SERVER } from '../../Config';
import { category } from '../../utils/Datas';

function AdminProductPage(props) {
    const [Products, setProducts] = useState([])


    const getProducts = () => {
        Axios.get(`${USER_SERVER}/admin/products`)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.products)
                } else {
                    alert('Lỗi lấy dữ liệu')
                }
            })
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
        getProducts()
    }, [])

    
    const renderCards = Products.map((product, index) => {
        return(
            <tr key={product._id} onClick={() => routeChange(product._id)}>
                <td>{index+1}</td> 
                <td>{product._id}</td> 
                <td>
                    <img style={{ width: '70px' }} alt="avatar" 
                    src={product.images[0] ?? ''} />
                    <div style={{display: 'inline-block', marginLeft: '10px'}} >{product.title}</div>
                </td> 
                <td>{category.find(item => item._id == product.category).name}</td>
                <td>{addDotToNumber(product.price)} VNĐ</td>
                <td>
                    {product.writer.name
                    ?
                    <div>
                        <img style={{ width: '70px' }} alt="avatar" 
                            src={product.writer.image} />
                        <div style={{display: 'inline-block', marginLeft: '10px'}} >{product.writer.name}</div>
                    </div>
                    :
                    <div style={{display: 'inline-block', marginLeft: '10px'}}>Người dùng bị xóa</div>
                    }
                </td>
                <td>{product.sold}</td> 
                <td>{product.views}</td> 
            </tr>   
        )
    })


    return (
        <div style={{width: '75%' , margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' , padding : '20px' }}>
                <h1> Danh sách mặt hàng</h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Mã mặt hàng</th>
                        <th>Tên</th>
                        <th>Loại</th>
                        <th>Giá</th>
                        <th>Người đăng</th>
                        <th>Đã bán</th>
                        <th>Đã xem</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default AdminProductPage