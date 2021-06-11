import './MaterialsSlider.css';
import PropTypes from "prop-types";
import {useState} from 'react'; 



const MaterialsSlider = ({materials, width, minRange, maxRange, overlap}) => {
    

    
    // Size of single step - considering width not always equals to 100
    const [stepWidth] = useState(()=>{
        return width/(maxRange-minRange)
    });

    // Range tracks
    const [tracks, setTracks] = useState(
        // Create track bars - trackbar with 2 handles for each material
        materials.map((material, index)=>{
            let trackDef = {
                id: index,
                label: material.name,
                color: material.color,
                width: (material.endNumber-material.startNumber)*stepWidth,
                handles: [
                 {
                     id: 1,
                     value: material.startNumber,
                     xPos: material.startNumber*stepWidth,
                     dragging: false
                 },
                 {
                     id: 2,
                     value: material.endNumber,
                     xPos: material.endNumber*stepWidth,
                     dragging: false
                 }
                ]
            }
            return trackDef
        }))
    
  
    // Handle dragging movement - stop dragging on mouse up
    const onMouseUp = (ev,  id, pos) => {
        let t = [...tracks];
      
        tracks.map((item)=>item.handles[0].dragging = false);
        tracks.map((item)=>item.handles[1].dragging = false);
       
        setTracks(t);
        
        ev.stopPropagation()
        ev.preventDefault()

    }
    
    // Handle dragging movement - start sliding on mousedown
    const onMouseDown = (e, id, pos) => {
        
        if (e.button !== 0) return
        
        let t =  [...tracks];
        let h = tracks.find(x=>x.id === id).handles[pos];
        let otherH = tracks.find(x=>x.id === id).handles[pos?0:1];
       
        h.dragging = true;

        handleMovement(e, h, otherH, t, id);
        setTracks(t);

        e.stopPropagation()
        e.preventDefault()
    }

   // Handle dragging movement
   const onMouseMove = (e, id, pos) => {

        let t = [...tracks];
        let h = tracks.find(x=>x.id === id).handles[pos];
        let otherH = tracks.find(x=>x.id === id).handles[pos?0:1];

        if (!h.dragging) return
   
        handleMovement(e, h, otherH, t, id);
        setTracks(t);

        e.stopPropagation()
        e.preventDefault()
        
    }

    //Helper - set handle new position
    const handleMovement = (e, h, otherH, t, id)=>{
        
        let offsetLeft = document.querySelector('.range-container').offsetLeft; //general slider left offset
        let handleWidth = e.currentTarget.getBoundingClientRect().width;  //handle element width
        let handleOffset = handleWidth/2; //put in the middle

        //middle of handle position between min and max range
        if((e.pageX - handleOffset) <= (width + offsetLeft + handleOffset) && e.pageX>=handleOffset)
        {  
            let newPos = e.pageX - offsetLeft - handleOffset;
            h.xPos =  e.pageX - offsetLeft - handleOffset;
           

            if(newPos < minRange)//limit according to slider min and max limits
                h.xPos = minRange;
            else if(newPos > width)
                h.xPos = width;
            else if(h.id == 1 && newPos >= otherH.xPos) //up = min value --> check min value is no greater than max value
                h.xPos = otherH.xPos-1;
            else if(h.id == 2 && newPos <= otherH.xPos) //down = max value --> check max value is no smaller than min value
                h.xPos = otherH.xPos+1;                                       
            else
                h.xPos = newPos;
            
            h.value = Math.floor(h.xPos/stepWidth); //value is not always equal to width 

            if(!overlap){
                    //limit according to other tracks
                    if (h.id == 1)  //min value handle  -> push overlapping handle left
                    {
                        let ovrlappingTrack = t.find(other=> id - 1 == other.id && other.handles[1].value >= h.value);
                        if(ovrlappingTrack)
                        {
                            if(h.value == 0) //got to start
                            {
                                ovrlappingTrack.handles[1].xPos = 0
                                ovrlappingTrack.handles[1].value = 0
                            }
                            else if(h.value - 1  < ovrlappingTrack.handles[0].value){  //got to first handle of overlapping track
                                h.xPos = ovrlappingTrack.handles[0].xPos
                                h.value = ovrlappingTrack.handles[0].value;
                            }
                            else{       
                                ovrlappingTrack.handles[1].xPos = h.xPos - stepWidth
                                ovrlappingTrack.handles[1].value = h.value -1
                            }
                        }
                    }
                    else{  //max value handle  -> push overlapping handle rigth
                        let ovrlappingTrack = t.find(other=> id + 1 == other.id && other.handles[0].value <= h.value);
                        if(ovrlappingTrack)
                        {
                            if(h.xPos  == maxRange) //got to end
                            {
                                ovrlappingTrack.handles[0].xPos = maxRange
                                ovrlappingTrack.handles[0].value =  Math.floor(maxRange/stepWidth)
                            }
                            else if(h.value + 1  > ovrlappingTrack.handles[1].value){  //got to second handle of overlapping track
                                h.xPos = ovrlappingTrack.handles[1].xPos
                                h.value = ovrlappingTrack.handles[1].value;
                            }
                            else
                            {
                                ovrlappingTrack.handles[0].xPos = h.xPos + stepWidth
                                ovrlappingTrack.handles[0].value = h.value + 1
                            }
                        }
                    }
            }
             
        }

    }



    return (
        <div style ={{width: width + 16}}>
            <div className='range-container'>
                <div className='range-scalebar' style ={{width: width, marginLeft: 8}}></div>
                
                {tracks.map((track)=>{
                        return <>
                            <div key={'handles_'+track.id} className='range-handles' onMouseUp =  {(e) => onMouseUp(e, track.id)}>
                                {/* Top handle: */}
                                <div  key={'handle0_'+track.id} className='range-handle' style={{left: track.handles[0].xPos}}>
                                    <div  className='range-handle-label'>{track.handles[0].value}</div>
                                    <div className='range-handle-element-top'  style={{borderTopColor: track.color}}
                                        onMouseDown = {(e) => onMouseDown(e, track.id, 0)}
                                        onMouseMove =  {(e) => onMouseMove(e, track.id, 0)}
                                        onMouseUp = {(e) => onMouseUp(e, track.id, 0)}
                                    ></div>
                                </div>
                                {/* Botttom handle: */}
                                <div key={'handle1_'+track.id} className='range-handle' style={{left: track.handles[1].xPos}}>
                                    <div className='range-handle-element-bottom'  style={{borderBottomColor: track.color}}
                                        onMouseDown = {(e) => onMouseDown(e, track.id, 1)}
                                        onMouseMove =  {(e) => onMouseMove(e, track.id, 1)}
                                        onMouseUp = {(e) => onMouseUp(e, track.id, 1)}
                                    ></div>
                                    <div className='range-handle-label'>{track.handles[1].value}</div>
                                </div>
                            </div>
                             {/* Range track: */}
                            <div className='range-track' style={{
                                width: track.handles[1].xPos -track.handles[0].xPos, 
                                left: track.handles[0].xPos,
                                borderColor: track.color,
                                backgroundColor: track.color}}></div>
                            <div className='range-track-label' style={{
                                width: track.handles[1].xPos -track.handles[0].xPos, 
                                left: track.handles[0].xPos,
                                color: track.color,
                               }} > {track.label} </div>  
                                </>
                       
                        
                        })}

                <div className='range-labels'>
                    <label className='range-min-label'>{minRange}</label>
                    <label className='range-max-label' style={{left: width}}>{maxRange}</label>
                </div>
              
                
            </div>

            <br/>
            <br/>
            
            
            {/* This part is just for test: */}
            {tracks.map((t)=>{
                return  <div>Material {t.label} : from {t.handles[0].value} to {t.handles[1].value} </div>
            })}

        </div>
    )
}


MaterialsSlider.defaultProps = {
    minRange: 0, 
    maxRange: 100,
    width: 200,
    overlap: true
}

MaterialsSlider.propTypes = {
    materials: PropTypes.arrayOf(PropTypes.shape({
        color: PropTypes.string.isRequired,
        startNumber: PropTypes.number.isRequired,
        endNumber: PropTypes.number.isRequired
      }))
};


export default MaterialsSlider
