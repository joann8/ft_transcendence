import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IUser } from '../Profile/profileStyle'
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Button, ButtonGroup, Chip, Typography } from '@mui/material';
import { Context } from '../MainCompo/SideBars';
import { LockOpenTwoTone, LockTwoTone } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import VideogameAssetIcon from '@mui/icons-material/VideogameAsset';
import FriendRequestModal from "./FriendRequestModal"
import NotificationAddIcon from "@mui/icons-material/NotificationAdd";
import { api_url } from '../../ApiCalls/var';


interface IFriend {
  user: IUser,
  relation: number
}

export default function FriendList() {

  const context = useContext(Context)

  const navigate = useNavigate()
  const [friendArray, setFriendArray] = useState<IFriend[]>([])
  const [ready, setReady] = useState(false)

  const [modal, setModal] = useState(false)
  let bol = true

  useEffect(() => {
    getFriends()
    return () => {bol = false}
  }, [modal])

  const getFriends = async () => {
    await fetch(api_url + "/relation/friends",
      {
        method: "GET",
        credentials: "include",
        referrerPolicy: "same-origin"
      })
      .then(res => {
        if (res.status === 401) 
        {
          navigate("/login");
          throw new Error("Unauthorized")
        }
        else if (!res.ok)
          throw new Error(res.statusText)
        return res.json()
      })
      .then(resArray => {   
        if (bol)
          setFriendArray(resArray)
      })
      .catch(err => {
        alert(err)
      })
    setReady(true)
  }


  const removeRelation = async (otherUserPseudo: string) => {
    const ret = await fetch(api_url + "/relation/remove", {
      credentials: "include",
      referrerPolicy: "same-origin",
      method: "DELETE",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        id_pseudo: otherUserPseudo
      })
    }).then(res => {
      if (res.status === 401) 
      {
        navigate("/login");
        throw new Error("Unauthorized")
      }
      else if (!res.ok)
        throw new Error(res.statusText)
      else
        return true
    })
      .catch((error) => {
        throw new Error(`${error}`)
      })
    return ret
  }

  const updateRelation = async (otherUserPseudo: string, newRelation1: number, newRelation2: number) => {
    const ret = await fetch(api_url + "/relation/update", {
      credentials: "include",
      referrerPolicy: "same-origin",
      method: "PUT",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify({
        id_pseudo2: otherUserPseudo,
        relation1: newRelation1,
        relation2: newRelation2
      })
    })
      .then(res => {
        if (res.status === 401) 
        {
          navigate("/login");
          throw new Error("Unauthorized")
        }
        else if (!res.ok)
          throw new Error(res.statusText)
        else
          return true
      })
      .catch((error) => {
        throw new Error(`${error}`)
      })
    return ret
  }

 


  const handleRemove = async (friend: IFriend) => {
    try {
      await removeRelation(friend.user.id_pseudo)
    }
    catch (error) {
      alert(error)
      return
    }

    const newArray = friendArray.filter(function (item) {
      return item !== friend;
    })
    setFriendArray(newArray)
    //Set friendArray
  }

  const handleBlock = async (friend: IFriend) => {

    try {
      await updateRelation(friend.user.id_pseudo, 4, 5)
    }
    catch (error) {
      alert(error)
      return
    }
    let newArray = [...friendArray]

    for (let i = 0; i < newArray.length; i++) {
      if (newArray[i] === friend) {
        newArray[i].relation = 4
        setFriendArray(newArray)
      }
    }
  }

  // AJOUT JOANN TEST DEFY


  const onClickDefy = (challenger: IUser, challengee: IUser) => {
    //console.log(`${challenger.id_pseudo} is defying ${challengee.id_pseudo}`);
    //console.log(`challenger status : ${challenger.status}`);
    if (challenger.status === "IN GAME")
      alert("Your are already in a game");
    else if (challengee.status === "IN GAME")
      alert(`${challengee.id_pseudo} is busy playing`);
    else if (challengee.status === "IN QUEUE")
      alert(`${challengee.id_pseudo} is already waiting for another player`);
    else if (challengee.status === "OFFLINE")
      alert(`${challengee.id_pseudo} is not connected`);
    else
      navigate(`/game/challenge/${challengee.id_pseudo}`);
  }

  const onClickWatch = (watcher: IUser, watchee: IUser) => {
    //console.log(`${watcher.id_pseudo} is watching ${watchee.id_pseudo}`);
    //console.log(`watchee status : ${watchee.status}`);
    if (watchee.status === "ONLINE" || watchee.status === "IN QUEUE")
      alert(`${watchee.id_pseudo} is not in a game at the moment`);
    else if (watchee.status === "OFFLINE")
      alert(`${watchee.id_pseudo} is not connected`);
    else
      navigate(`/game/watch/${watchee.id_pseudo}`);
  }


  if (!ready) {
    return (
      <React.Fragment>
        <Typography> Loading </Typography>
      </React.Fragment>
    )
  }
  else {
    return (
      <TableContainer component={Paper}>
        <Table size="medium" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={2} align="center">Friends</TableCell>
              <TableCell align="center"> Status </TableCell>
              <TableCell align="right">
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<NotificationAddIcon color="error" />}
                  onClick={() => {
                    setModal(true);
                  }}
                >
                  Friend Request
                </Button>
                {modal ? (
                  <FriendRequestModal
                    user={context.user}
                    modalState={modal}
                    setModal={setModal}
                  />
                ) : null}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {friendArray.map((friend) => (
              <TableRow
                key={friend.user.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="right">
                  {friend.user.id_pseudo}
                </TableCell>
                <TableCell align="left">
                  <Avatar src={friend.user.avatar} />
                </TableCell>
                <TableCell align="center">
                  <Chip label={friend.user.status} />
                </TableCell>
                <TableCell align="left">
                  <ButtonGroup size="small" variant="contained">
                    {friend.user.status === "IN GAME" ? <Button color="info" onClick={() => onClickWatch(context.user, friend.user)} >
                      Watch
                    </Button> : null}
                    {friend.user.status === "ONLINE" ? <Button color="secondary" startIcon={<VideogameAssetIcon />} onClick={() => onClickDefy(context.user, friend.user)}>
                      Defy
                    </Button> : null}
                    <Button color="warning" startIcon={<ClearIcon />} onClick={() => handleRemove(friend)}>
                      Remove
                    </Button>
                    {
                      friend.relation === 4 ?
                        <Button color="secondary" startIcon={<LockOpenTwoTone />} onClick={() => handleRemove(friend)}>
                          UnBlock
                        </Button>
                        :
                        <Button color="error" startIcon={<LockTwoTone />} onClick={() => handleBlock(friend)}>
                          Block
                        </Button>
                    }
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer >
    )
  }
}