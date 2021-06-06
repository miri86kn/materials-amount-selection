import PropTypes from "prop-types";
import Slider, { Range, SliderTooltip } from 'rc-slider';
import {useState} from 'react';
import 'rc-slider/assets/index.css';
import './MultiSliderRange.css';

const MultiRangeSlider = ({ materials , onChange,  minRangeValue, maxRangeValue}) => {

    const createSliderWithTooltip = Slider.createSliderWithTooltip;
    const Range = createSliderWithTooltip(Slider.Range);
    
   
    //add some ids for proper key, label, and result values properties
    const materialsProps = materials.map((material, index) => {
        var item = {  
                      id: index, 
                      values: [material.startNumber , material.endNumber], 
                      obj: material,
                      label: String.fromCharCode("A".charCodeAt(0) + index)
                    }
        
        return item;
    });

    //Results of the range slider will be stored here:
    //for each material the result is in values[min,max]: 
    const [sliderValues, setSliderValues] = useState(materialsProps)
    
    //When chahge range value for one of the materials - update results value
    const onRangeChange = (value, index)=>{

        sliderValues.find(x=>x.id==index).values = value;

        if(onChange)
            onChange(sliderValues)
    }
   
    //Generate Range Handle style 
    const getHandleStyle = (color)=>{
        return {
            width: 0,
            height: 0,
            backgroundColor: "transparent",
            borderStyle: "solid",
            borderLeftWidth: 5,
            borderRightWidth: 5,
            borderTopColor: color,
            borderBottomColor: color,
            borderLeftColor: "transparent",
            borderRightColor: "transparent",
            borderRadius: 0
        };
    }

    //Get handle type for tooltip position
    const getHandleType = (value, index)=>{
       var item = sliderValues.find(x=>x.id == index);
       //if value is smaller than max selection then it is the first handle, else the second
       if(value < item.values[1]) return 'custom-tip-up'
       else return 'custom-tip-down'
    }

  return (
    <>
    
     {materialsProps.map((material) =>( 
     <div  key={material.id.toString()} className='inline-title' style={{width: (material.obj.endNumber - material.obj.startNumber)*3}}>
         {material.label}
     </div>
     ))}

    <div style={{clear: "both"}} />


    <div className='inline-range'>{minRangeValue}</div>
    
    {materialsProps.map((material) =>(

        <div key={material.id.toString()} className='inline-range'>
            <Range
                    key={material.id.toString()}
                    min={material.obj.startNumber}
                    max={material.obj.endNumber}
                    step={1}
                    defaultValue={[material.obj.startNumber, material.obj.endNumber]}
                    handleStyle={[getHandleStyle(material.obj.color)]}
                    trackStyle={[{backgroundColor: material.obj.color}]}
                    allowCross={false}
                    tipFormatter={
                        (value) =>
                     <span className={getHandleType(value, material.id)}>{value}</span>
                    }
                    tipProps={{
                        prefixCls: 'custom-slider-tooltip',
                        visible: true
                    }}
                    onChange={(value) => { onRangeChange(value, material.id) }}
                    style={{width: (material.obj.endNumber - material.obj.startNumber)*3}}
                /></div>
            
            ))}

     <div className='inline-range'>{maxRangeValue}</div>
    </>
  );
};

MultiRangeSlider.defaultProps = {
    minRangeValue: 0, //assumed that marial quantity is 0-100% ....
    maxRangeValue: 100
}

MultiRangeSlider.propTypes = {
    materials: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        startNumber: PropTypes.number.isRequired,
        endNumber: PropTypes.number.isRequired
      }))
};


export default MultiRangeSlider;


