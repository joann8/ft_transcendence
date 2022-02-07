import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IUser } from '../Profile/profileStyle'
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router';
import { Avatar, Button, ButtonGroup, Typography } from '@mui/material';
import { Context } from '../MainCompo/SideBars';

const backEndUrl = "http//:127.0.0.1:3001"

export default function FriendList() {

    const context = useContext(Context)

    const navigate = useNavigate()
    const [friendArray, setFriendArray] = useState<IUser[]>([])
    const [ready, setReady] = useState(false)

    const getFriends = async () => {
        await fetch("http://127.0.0.1:3001/relation/friends",
            {
                method: "GET",
                credentials: "include",
                referrerPolicy: "same-origin"
            })
            .then(res => {
                if (res.status === 401)
                    navigate("/login")
                else if (!res.ok)
                    throw new Error(res.statusText)
                return res.json()
            })
            .then(resArray => {    // FIN AJOUT JOANN
                setFriendArray(resArray)
                console.log("Friend Array : ", friendArray)
            })
            .catch(err => {
                alert(`GetFriends :  ${err}`)
            })
        setReady(true)
    }


    const removeRelation = async (otherUserPseudo: string) => {
        const ret = await fetch(`${backEndUrl}/relation/remove`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo2: otherUserPseudo
            })
        })
            .then(res => {
                if (res.status === 401)
                    navigate('/login')
                else if (!res.ok)
                    throw new Error(res.statusText)
                else
                    return true
            })
            .catch((err) => {
                alert(`removeRelation : Error : ${err}`)
                return false
            })
        return ret
    }

    const updateRelation = async (otherUserPseudo: string, newRelation1: number, newRelation2: number) => {
        const ret = await fetch(`${backEndUrl}/relation/update`, {
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
                    navigate('/login')
                else if (!res.ok)
                    throw new Error(res.statusText)
                else
                    return true
            })
            .catch((err) => {
                alert(`updateRelation: ${err}`)
                return false
            })
        return ret
    }

    React.useEffect(() => {
        getFriends()
    }, [])


    const handleRemove = async (friend: IUser) => {
        console.log("Remove called")

        const ret = await removeRelation(friend.id_pseudo)
        const newArray = friendArray.filter(function (item) {
            return item !== friend;
        })
        setFriendArray(newArray)
        //Set friendArray
    }

    const handleBlock = async (friend: IUser) => {
        console.log("Block called")
        const ret = await updateRelation(friend.id_pseudo, 4, 5)
        const newArray = friendArray.filter(function (item) {
            return item !== friend;
        })
        setFriendArray(newArray)
        //Set friendArray

    }
    
    // AJOUT JOANN TEST DEFY


    const onClickDefy = (challenger : IUser, challengee : IUser) => {
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

    const onClickWatch = (watcher : IUser, watchee : IUser) => {
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
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={3} align="center">Friends</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {friendArray.map((friend) => (
                                <TableRow
                                    key={friend.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="right">
                                        {friend.id_pseudo}
                                    </TableCell>
                                    <TableCell align="left">
                                        <Avatar src={friend.avatar} />
                                    </TableCell>
                                    <TableCell align="left">
                                        <ButtonGroup variant="contained">
                                            {friend.status === "IN GAME" ? <Button color="info"  onClick={() => onClickWatch(context.user, friend)} >
                                                Watch
                                            </Button> : null}
                                            {friend.status === "ONLINE" ? <Button color="secondary" onClick={() => onClickDefy(context.user, friend)}>
                                                Defy
                                            </Button> : null}
                                            <Button color="warning"onClick={() => handleRemove(friend)}>
                                                Remove
                                            </Button>
                                            <Button color="error" onClick={() => handleBlock(friend)}>
                                                Block
                                            </Button>
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer >
        );
    }
}