import React from 'react'

function HistoryPage(props) {

    const addDotToNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formattedDate = (date) => {
        let dateOfPurchase = new Date(date);

        let day = ("0" + dateOfPurchase.getDate()).slice(-2);
        let month = ("0" + (dateOfPurchase.getMonth() + 1)).slice(-2);
        let year = dateOfPurchase.getFullYear();

        let hours = ("0" + dateOfPurchase.getHours()).slice(-2);
        let minutes = ("0" + dateOfPurchase.getMinutes()).slice(-2);

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    }
    
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
                        <th>Trạng thái</th>
                    </tr>
                </thead>

                <tbody>

                    {props.user.userData && props.user.userData.history &&
                        props.user.userData.history.map(item => (
                            <tr>
                                <td>{item.paymentId}</td>
                                <td>{item.name} {item.size != null ? ` cỡ ${item.size}` : ''}</td>
                                <td>{addDotToNumber(item.price ?? 0)}VNĐ</td>
                                <td>{item.quantity}</td>
                                <td>{formattedDate(item.dateOfPurchase)}</td>
                                <td>{item.status}</td>
                            </tr>
                        ))}


                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage
