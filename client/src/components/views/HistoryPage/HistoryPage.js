import React from 'react'

function HistoryPage(props) {
    
    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ textAlign: 'center' }}>
                <h1>Lịch sử</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Mã hóa đơn</th>
                        <th>Sản phẩm</th>
                        <th>Giá tiền</th>
                        <th>Số lượng</th>
                        <th>Ngày mua</th>
                    </tr>
                </thead>

                <tbody>

                    {props.user.userData && props.user.userData.history &&
                        props.user.userData.history.map(item => (
                            <tr>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.price}.000VNĐ</td>
                                <td>{item.quantity}</td>
                                <td>{Date(item.dateOfPurchase)}</td>
                            </tr>
                        ))}


                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
