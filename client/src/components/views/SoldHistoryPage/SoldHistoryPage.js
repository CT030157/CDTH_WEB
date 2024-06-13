import React,{ useState , useEffect} from 'react'
import Axios from 'axios';
import { PRODUCT_SERVER } from '../../Config';
function SoldHistoryPage(props) {
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()


    const getProducts = (variables) => {
        Axios.post(`${PRODUCT_SERVER}/getWriter`, variables)
            .then(response => {
                if (response.data.success) {
                    if (variables.loadMore) {
                        setProducts([...Products, ...response.data.products])
                    } else {
                        setProducts(response.data.products)
                    }
                    setPostSize(response.data.postSize)
                } else {
                    alert('Failed to fectch product datas')
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
    
    const renderCards = Products.map((product, index) => {
        return(
            <tr key={product._id}>
                <td>{product.title}</td> 
                <td>{addDotToNumber(product.price ?? 0)}VNĐ </td>
                <td>{product.sold}</td>
                <td>{addDotToNumber(product.sold*product.price)}VNĐ</td>
            </tr>   
        )
    })


    return (
        <div style={{width: '75%' , margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' , padding : '20px' }}>
                <h1> Lịch sử bán hàng </h1>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá tiền</th>
                        <th>Đã bán</th>
                        <th>Thu được</th>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
        </div>
    )
}

export default SoldHistoryPage