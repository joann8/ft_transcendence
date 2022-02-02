import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord, resolveSoa } from 'dns';
import { Fragment, useEffect, useState } from 'react';
import { Avatar, Card, CardContent, CardMedia, Divider, Grid } from '@mui/material';
import Alone from "../Images/alone.jpg"
import { useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    backgroundColor: "rgba(100, 100, 100, 1)",
    transform: 'translate(-50%, -50%)',
    width: "85%",
    height: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    display: "flex",
    flexFlow: "column wrap",
    justifyContent: "flex-start",
    alignContent: "center",
    p: 1,
    overflow: "scroll"
};

const request = {
    width: "100%",
    minHeight: "15%",
    marginLeft: "2%"
}


const user = {
    id: 0,
    id_pseudo: "",
    email: "",
    avatar: "",
    role: "",
    elo: 0,
    status: "",
    two_factor: false,
    achievement1: false,
    achievement2: false,
}

export default function FriendRequestModal(props: any) {
    /*  const [modal, setModal] = React.useState(props.modalState);
      useEffect(() => {
          props.setModal(modal);
      }, [props.modalState])
      */
    const navigate = useNavigate()
    const [localUpdate, setLocalUpdate] = useState(0)
    const [requestArray, setRequestArray] = useState(null)


    console.log("friendModal props: ", props)
    const getFriendRequest = async () => {
        await fetch(`http://127.0.0.1:3001/relation/request`, {
            method: "GET",
            credentials: "include",
            referrerPolicy: "same-origin"
        })
            .then((res) => {
                if (res.status === 401)
                    navigate("/login")
                else if (!res.ok)
                    throw new Error(res.statusText)
                return res.json()
            })
            .then(res => {
                if (!res.length)
                    setRequestArray(null)
                else
                    setRequestArray(res)
            })
            .catch(err => {

                alert(`FriendRequest : Error Fetching Data: ${err.statusText}`)
            })
    }

    const updateRelation = async (myUserPseudo: string, otherUserPseudo: string, newRelation1: number, newRelation2: number) => {
        const ret = await fetch(`http://127.0.0.1:3001/relation/update`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "PUT",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo1: myUserPseudo,
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

    const removeRelation = async (myUserPseudo: string, otherUserPseudo: string) => {
        const ret = await fetch(`http://127.0.0.1:3001/relation/remove`, {
            credentials: "include",
            referrerPolicy: "same-origin",
            method: "DELETE",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({
                id_pseudo1: myUserPseudo,
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


    useEffect(() => {
        console.log("RequestingFriend List")
        getFriendRequest()
    }, [localUpdate])

    const handleAccept =  async (friendPseudo : string) => {
        //ret = Update friendship request
        //Dans le back update et renvoie la liste courante des request
        await updateRelation(props.user.id_pseudo, friendPseudo, 3, 3)
        setLocalUpdate(localUpdate + 1)
        //setFriendRequest(ret)
    }

    const handleRefuse = async (friendPseudo : string) => {
        //Mm chose mais avec un status different 
        await removeRelation(props.user.id_pseudo, friendPseudo)
        setLocalUpdate(localUpdate + 1)
    }

    const handleClose = () => props.setModal(false);



    return (
        <Fragment>
            <Modal
                open={props.modalState}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {requestArray ?
                    <Box sx={style}>

                        <Grid container sx={request}>
                            <Grid container item sx={{
                                justifyContent: "space-evenly",
                                alignItems: "center",
                                backgroundColor: "rgba(0, 0, 0, 0.4)",

                            }}>
                                {requestArray.map((user) =>
                                    <Fragment key={user.id}>
                                        < Grid item xs={3}>
                                            <Avatar sx={{
                                                marginLeft: "10px",
                                                width: "50px",
                                                height: "50px"
                                            }} src={user.avatar} />
                                        </Grid>
                                        <Grid item xs={3}> {user.id_pseudo} </Grid>
                                        <Grid item xs={3}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleAccept(user.id_pseudo)}>Accept </Button>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button
                                                variant="contained"
                                                color="warning"
                                                onClick={() => handleRefuse(user.id_pseudo)}>Refuse </Button>
                                        </Grid >
                                        <Divider variant="middle"/>
                                    </Fragment>
                                )}
                            </Grid>
                        </Grid>
                    </Box>

                    :
                    <Card sx={style}>
                        <CardMedia component="img" image={Alone} />
                        <CardContent>
                            <Typography variant="body1">
                                Ouch ... sorry but it seems that no one wants to be your friend
                            </Typography>
                        </CardContent>

                    </Card>
                }

            </Modal>
        </Fragment >
    );
}