const RoleList = ({ roles, actor }) => {
    
    return (  
        <div className="roleList">
            {roles.map((role) => (
                <div className="role-preview" key={role.charID}>
                    <img className="charImg" src={role.img} alt={role.character} />
                    <div className="role-preview-text">
                        <h2>{role.character}</h2>
                        <p>from <a href="">{role.show}</a></p>
                    </div>
                </div>
            ))}
        </div>
    );
}
 
export default RoleList;
