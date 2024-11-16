import React from "react";
import SimpleImageSlider from "react-simple-image-slider";
import slide1 from '../assets/images/access1.jpeg';
import slide2 from '../assets/images/access2.jpg';
import slide3 from '../assets/images/access3.jpg';
import slide4 from '../assets/images/access4.jpg';
import slide5 from '../assets/images/access5.jpg';
import slide6 from '../assets/images/access6.jpg';
import '../assets/ImageSlider.css';

// FontAwesome icons
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

const images = [
    { url: slide6 },
    { url: slide5 },
    {url:  slide3},
    { url: slide4 },
    { url: slide1 },
    { url: slide2 }
    
];

function ImageSlider() {
    return (
        <div className="slider-container">  
            <SimpleImageSlider 
        
                style={{marginLeft:"-150px"}}
                className="slider"
                width={1300}
                height={650}
                images={images}
                showNavs={true}
                autoPlay={true}  
                autoPlayDelay={5.0}  
                onClick={(idx, event) => console.log(`Image ${idx + 1} clicked`)}
                // Custom navigation components
                customNavs={
                    (onPrev, onNext) => (
                        <div className="custom-navs">
                            <button className="prev-arrow"  style = {{ border: "10px", borderRadius:"20px"}} onClick={onPrev}>
                                <FaArrowLeft size={30} color="#000"  style={{backgroundColor:"blue"}} />
                            </button>
                            <button className="next-arrow" onClick={onNext}>
                                <FaArrowRight size={30} color="#000" />
                            </button>
                        </div>
                    )
                }
            />
        </div>
    );
}

export default ImageSlider;
