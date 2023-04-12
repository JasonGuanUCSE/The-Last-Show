import react,{useState,useEffect} from "react";
import OverLay from "./OverLay";
import ply from './ply.png';
import stp from './stp.png';

function Obituary()
{
    const[name,setName] = useState("");
    const[btn,setBtn]=useState(null);
    const [obituaries,setObituary]= useState([]);
    const [a,setA]=useState();
    var num =0;





    const getOb= async()=>{
    const promise2 = await fetch(`https://ri3guhrb6p5p5vapeht2wetx5u0uluiu.lambda-url.ca-central-1.on.aws/`,
    {
        method:"GET"      
    }
        );
    
          const obituary = await promise2.json();
          //console.log(obituary);
          setObituary(obituary);
      }
    
    useEffect(()=>{
        if(btn==1){getOb();setBtn(null)}

    },[btn])

    useEffect(()=>
    {
        let obj = true;
        num++;
        if(obj===true&&num===1){getOb();obj=false;};



    },[])

    //console.log(obituaries.map((ob)=>console.log(ob)));
    // var playing = true;

    // const playSound=(e)=>
    // {
    //     var a= new Audio(e)
    //     if(playing){a.play();}
    //     else{a.pause();}
    // }
    const[isPlaying,setIsPlaying] = useState(false);


    const playing =()=>
    {
        if(isPlaying)
        {
            return ply;
        }
        else
        {
            return stp;
        }





    }

    const playAudio = (index)=>
    {

        if(isPlaying&&document.getElementById(`sound-${index}`))
        {
            document.getElementById(`sound-${index}`).pause();
            setIsPlaying(false);
            setA(null);
        }
        else if(!isPlaying&&document.getElementById(`sound-${index}`))
        {
            document.getElementById(`sound-${index}`).play()
            setIsPlaying(true);
            setA(index)
        }


    }


    const formatDate=(e)=>
    {
        const date= new Date(e);
        const option = {month:'long',day:'numeric',year:'numeric'}
        const formatted = date.toLocaleDateString('en-US',option);
        return formatted;




    }


    return(
        <div>
            <div id="noItems">
                {!obituaries&&"No Obituary Yet"}
            </div>
            
            <div id="showCase">

                {obituaries.map((ob,index)=>
                <div id="Case">
                    
                    <img id="Image" src={ob["Image"]} />
                    <div id="NameDeath">{ob["Name"]}</div>
                    {/* <div id="BornDate">{ob["BornDay"]}</div>
                    <div id="DeathDate">{ob["DeathDay"]}</div> */}
                    <div id="Date">{formatDate(ob["BornDay"])} - {formatDate(ob["DeathDay"])}</div>



                    <p id="Description">{ob["Obituary"]}</p>
                    <audio id={`sound-${index}`} src={ob["Audio"]} type={ob["Audio"]}></audio>
                    <div id="play"><img src={index===a ? stp : ply} onClick={() => playAudio(index)} /></div>
                    
                    
                </div>)}
            
            
            </div>






            <OverLay name={name} setName={setName} btn={btn} setBtn={setBtn}/>


        </div>

    );
}

export default Obituary;