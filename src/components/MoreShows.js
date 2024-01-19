import React from "react";
import { Button, Popup } from 'semantic-ui-react'


const MoreShows = ({ titles }) => {
   
    <Popup content={titles} trigger={<Button icon='add' />} />
    
        //     <div>
    //         {console.log(titles)}
    //     {
    //         titles.map((title) => 
    //             <p>{title}</p>
    //         )
    //     }   
    //     </div>
    // );
}
 
export default MoreShows;