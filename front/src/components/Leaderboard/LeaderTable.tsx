import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { Avatar, Button } from '@mui/material';


export default function LeaderTable() {

  const navigate = useNavigate();

  const [update, setUpdate] = useState(false);
  const [leaders, setLeaders] = useState([]);
  
  useEffect(() => {
      const getLeaders = async () => {
      fetch("http://127.0.0.1:3001/user/all/leaderboard", {
          method: "GET",
          credentials : "include",
          referrerPolicy: "same-origin"
      })
      .then((res) => {
        if (res.status === 401)
          navigate("/login");
        else if (!res.ok)
           throw new Error(res.statusText);
        return (res.json());
      })
      .then((resJson) => {
          console.log(resJson);
          setLeaders(resJson);
      })
      .catch((err) => {
          console.log("Error caught: ", err);
      })
      };
      getLeaders();
  }, [update]); 

  const handleUpdate=() => {
    if (update === false)
      setUpdate(true);
    else
      setUpdate(false);
  }

  return (
        <TableContainer component={Paper}>
          <Table >
            <TableHead>
              <TableRow>
                <TableCell align="center" colSpan={2}> LEADERBOARD </TableCell>
                <TableCell align="right" colSpan={1}>
                    <Button variant="outlined" color="secondary" onClick={handleUpdate}> Update </Button>
                </TableCell>             
              </TableRow>
              <TableRow>
                <TableCell align="center" colSpan={2}> Player </TableCell>
                <TableCell align="center" colSpan={1}> Elo </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaders.map((user : any) => (
                <TableRow
                  key={user.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell align="right"> {user.id_pseudo} </TableCell>
                  <TableCell align="left"> <Avatar src={user.avatar} /> </TableCell>
                  <TableCell align="center"> {user.elo} </TableCell>        
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
  )
};