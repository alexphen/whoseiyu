import ShowInfo from "./ShowInfo";

const showsList = (shows) => {

    const showsList = [];
    for (let i in shows["shows"]) {
        showsList[i] = shows["shows"][i];
    }

    return ( 
        <div className="showsList">
                {showsList.map((show) => (
                    <div key={show.showID} id="altTitle" >
                        <ShowInfo show={show}/>
                    </div>
            ))}
        </div>
     );
}
 
export default showsList;