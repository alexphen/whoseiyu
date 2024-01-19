import RoleList from "./RoleList";

const ActorList = ({ actors }) => {
    const actorsList = [];
    for (let i in actors) {
        actorsList[i] = (actors[i]);
    }
    console.log(actorsList[1]);

    return (     
        <div className="actorList">
            
            {actorsList.map((actor) => 
            
                <div key={actor.actorID}>
                    <h2 className="actorName">{actor.name}</h2>
                    <RoleList roles={actor.roles} actor={actor.name} key={actor.actorID}/>
                </div>
            )}
        </div>
);
}
 
export default ActorList;