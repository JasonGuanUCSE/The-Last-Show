import logo from "./img.png";


function OverLay() {
    return (
      
        <div id="over">
          <div id="CloseOver">
            X
        </div>
          <div id="TitleOverLay">
            Create a New Obituary
          </div>
          
          
          
          <div id="OverLayPic">
            <img src={logo} width="200px" height="200px"></img>
            <div>Select an image for the deceased</div>
          </div> 

          <div id="NameDied">

            <input type="text" placeholder="Name of the deceased"/>

          </div>
          <div id="OverLayDates">
            <p><i>Born: </i></p>
            <input type="datetime-local"/>
            <p><i>Died: </i></p>
            <input type="datetime-local"/>

          </div>

          <div id="WriteObituary">
            <button>Write Obituary</button>
          </div>

        </div>


    );
  }
  
export default OverLay;