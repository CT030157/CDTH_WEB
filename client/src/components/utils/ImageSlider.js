import React from 'react'
import { Carousel } from 'antd';
var host = window.location.protocol + "//" + window.location.hostname;

function ImageSlider(props) {
    return (
        <div>

            <Carousel autoplay autoplaySpeed={5000}>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img style={{ width: '100%', maxHeight: '150px' }}
                            src={`${host}:4444/${image}`} alt="productImage" />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
