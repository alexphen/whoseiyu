import { useParams, Link } from "react-router-dom";


const HomeChar = ({charName, charImg, topTitleID, topTitle}) => {

// console.log("name", charName, "img", charImg, "topTitleID", topTitleID, "topTitle", topTitle)

    return (  
        <div className="homeChar">
            <div className="homeImgContainer">
                <img className="homeCharImg" src={charImg} alt={charName}></img>
            </div>
            <h3 className="homeCharName">{charName}</h3>
            <Link to={`/Anime/${topTitleID}/${topTitle}`} id="topTitle">{topTitle}</Link>
        </div>
    );
}
 
export default HomeChar;