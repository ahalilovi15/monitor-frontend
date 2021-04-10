import { connect } from "react-redux";
import UsersTable from '../../components/UsersTable/UsersTable';
import React, { useState, useEffect } from 'react';
import { push } from "connected-react-router";
import { RouteLink } from "../../store/modules/menu/menu";
import {  FormControl, MenuItem, Select , Popover  } from "@material-ui/core";
import request, { userTasks } from "../../service";


const Tasks = ({push}) => {
    const [users, setUsers] = useState([]); 
    const [tasks, setTasks] = useState({});
    
    const setData = async () => {
        
      
            setUsers([]);
            const res = await request("https://si-2021.167.99.244.168.nip.io/api/user/All");
            

            var data =res.data.data;
           
            for(let user of data) {
                users.push(user);
            }
                
            setUsers(users);
            
        
       
    };
   
    useEffect(() => {
        setData();
    }, []);

    useEffect(() => {
        request(userTasks).then(r => setTasks(r.data.data[4].userTasks));
        
    }, [])

    return (
        <div className="reportingWrapper page">
             <div  className="header">
                <h1> Users List</h1>
                
            </div>
            <div className="usersTable">
                <UsersTable users={ users } tasks={ tasks }/>     
            </div>
        </div>
    )
};
export default connect(state => ({}), {push})(Tasks);
