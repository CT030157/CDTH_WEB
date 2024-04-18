import React,{ useState , useEffect} from 'react'
import Axios from 'axios'
function SoldHistoryPage(props) {
    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState()


    const getProducts = (variables) => {
        Axios.post('/api/product/getWriter', variables)
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
    
    const renderCards = Products.map((product, index) => {
        return(
            <tr key={product._id}>
                <td>{product.title}</td> 
                <td>{product.price}.000VNĐ </td>
                <td>{product.sold}</td>
                <td>{product.sold*product.price}.000VNĐ</td>
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