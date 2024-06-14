import React,{ useState , useEffect} from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    scales,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';
  import Axios from 'axios';
  import { useHistory } from "react-router-dom";
  import faker from 'faker';
  import { USER_SERVER } from '../../Config';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

  const getLabelChartWeek = () => {
    const result = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      result.push(`${day}/${month}`);
    }
    return result.reverse();
  };

  const getLabelChartMonth = () => {
    const result = [];
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const day = ("0" + d.getDate()).slice(-2);
      const month = ("0" + (d.getMonth() + 1)).slice(-2);
      result.push(`${day}/${month}`);
    }
    return result.reverse();
  };

  const getLabelChartYear = () => {
    const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const month = ("0" + (d.getMonth() + 1)).slice(-2);
    const year = d.getFullYear();
    result.push(`${month}/${year}`);
  }
  return result.reverse();
  };

function AdminDashboardPage(props) {
  let initialLabels = getLabelChartYear()
  const [labels, setLabels] = useState(initialLabels)
  const [selectValue, setSelectValue] = useState('Theo Tuần')
  const [Users, setUsers] = useState([])
  const [Products, setProducts] = useState([])


  const getUsers = () => {
    Axios.get(`${USER_SERVER}/admin/users`)
        .then(response => {
            if (response.data) {
                let users = response.data.users;
                users.map(user => {
                  let total = 0
                  if (user.history.length > 0){
                    total = calculateTotal(user.history);
                  }
                  user.total = total
                })
                users.sort((a, b) => b.total - a.total);
                let top5Users = users.slice(0,5)
                setUsers(top5Users)
            } else {
                alert('Lỗi lấy dữ liệu')
            }
        })
  }

  const getProducts = () => {
    Axios.get(`${USER_SERVER}/admin/products`)
        .then(response => {
            if (response.data.success) {
                let products = response.data.products;
                products.sort((a, b) => b.sold - a.sold);
                let top5Products = products.slice(0,5)
                setProducts(top5Products)
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
      
      return total;
  }

  const addDotToNumber = (num) => {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  const history = useHistory();

  const routeChange = (id) =>{ 
      let path = `/admin/product/${id}`; 
      history.push(path);
  }

  const onSelectChange = (event) => {
    console.log(event.currentTarget.value);
    setSelectValue(event.currentTarget.value);
    switch(event.currentTarget.value){
      case 'Theo Tuần': {setLabels(getLabelChartWeek()); break;}
      case 'Theo Tháng': {setLabels(getLabelChartMonth()); break;}
      case 'Theo Năm': {setLabels(getLabelChartYear()); break;}
      default: {setLabels(getLabelChartWeek()); break;}
    }
  }

  useEffect(() => {
      getUsers();
      getProducts();
  }, [])


  const optionsPayments = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu',
      },
    },
  };

  const optionsUsers = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Người dùng',
      },
    },
  };

  const optionsProducts = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sản phẩm',
      },
    },
  };
  
  const dataPayments = {
    labels,
    datasets: [
      {
        label: 'Số tiền(VNĐ)',
        data: labels.map(() => faker.datatype.number({ min: 5000000, max: 10000000 })),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const dataUsers = {
    labels,
    datasets: [
      {
        label: 'Số người dùng đăng nhập',
        data: labels.map(() => faker.datatype.number({ min: 5, max: 10})),
        borderColor: 'rgb(153, 102, 255)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const dataProducts = {
    labels,
    datasets: [
      {
        label: 'Đã xem',
        data: labels.map(() => faker.datatype.number({ min: 20, max: 50})),
        borderColor: 'rgb(255, 159, 64)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
      },
      {
        label: 'Đã bán',
        data: labels.map(() => faker.datatype.number({ min: 10, max: 20})),
        borderColor: 'rgb(255, 205, 86)',
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
      },
    ],
  };


  const renderUsers = Users.map((user, index) => {
    return(
        <tr key={user._id}>
            <td>
                <img style={{ width: '20px' }} alt="avatar" 
                src={user.image} />
                <div style={{display: 'inline-block', marginLeft: '10px'}} >{user.name}</div>
            </td> 
            <td>{addDotToNumber(user.total)} VNĐ</td>
        </tr>   
    )
  })

  const renderProducts = Products.map((product, index) => {
    return(
        <tr key={product._id} onClick={() => routeChange(product._id)}>
          <td>
              <img style={{ width: '20px', height: 'auto' }} alt="avatar" 
              src={product.images[0] ?? ''} />
              <div style={{display: 'inline-block', marginLeft: '10px'}} >{product.title}</div>
          </td> 
          <td>{product.sold} chiếc</td> 
      </tr> 
    )
  })


    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{display: 'flex', justifyContent: 'flex-end', width: '100%', marginRight: '3rem auto'}}>
              <select onChange={onSelectChange} value={selectValue}>
                  <option key={1} value={'Theo Tuần'}>Theo Tuần</option>
                  <option key={2} value={'Theo Tháng'}>Theo Tháng</option>
                  <option key={3} value={'Theo Năm'}>Theo Năm</option>
              </select>
            </div>
            <div style={{ display: 'flex', height: 'auto' }}>
              <div style={{ flex: 2, margin: '20px', border: '2px solid #e2e8f0', borderRadius: '10px'}}>
                <Line options={optionsPayments} data={dataPayments} style={{width: '100%', height: '100%', margin: '10px'}}/>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', margin: '20px'}}>
                <div style={{ flex: 2 , border: '2px solid #e2e8f0', borderRadius: '10px'}}>
                  <Line options={optionsUsers} data={dataUsers} style={{width: '100%', height: '100%', margin: '10px'}}/>
                </div>
                <div style={{ flex: 2 , border: '2px solid #e2e8f0', borderRadius: '10px', margin: '10px'}}>
                  <Line options={optionsProducts} data={dataProducts} style={{width: '100%', height: '100%', margin: '10px'}}/>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', height: 'auto' }}>
              <div style={{ flex: 2, margin: '20px', border: '2px solid #e2e8f0', borderRadius: '10px'}}>
                <div style={{ textAlign: 'center' , padding : '20px' }}>
                  <h1> Top người dùng</h1>
                </div>
                <table>
                    <tbody>
                        {renderUsers}
                    </tbody>
                </table>
              </div>
              <div style={{ flex: 2, margin: '20px', border: '2px solid #e2e8f0', borderRadius: '10px'}}>
                <div style={{ textAlign: 'center' , padding : '20px' }}>
                    <h1> Top sản phẩm</h1>
                  </div>
                  <table>
                      <tbody>
                          {renderProducts}
                      </tbody>
                  </table>
              </div>
            </div>
        </div>
    )
}

export default AdminDashboardPage
