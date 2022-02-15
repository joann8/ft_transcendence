import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Fragment, useEffect, useState } from 'react';
import { Avatar, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { IUser } from '../Profile/profileStyle';
import { api_url } from '../../ApiCalls/var';

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
  padding: "10px",
  alignItems: "center",
  // border: " 1px solid black"

}


export default function FriendRequestModal(props: any) {

  const navigate = useNavigate()
  const [requestArray, setRequestArray] = useState(null)


  const getFriendRequest = async () => {
    await fetch(api_url + "/relation/request", {
      method: "GET",
      credentials: "include",
      referrerPolicy: "same-origin"
    })
      .then((res) => {
        if (res.status === 401 || res.status === 403) {
          if (res.status === 403)
            alert("You are banned from this website")
          navigate("/login")
        }
        else if (!res.ok) {
          console.log("res : ", res)
          throw new Error(res.statusText)
        }
        return res.json()
      })
      .then(res => {
        setRequestArray(res)
      })
      .catch(err => {
        alert(`FriendRequest : Error Fetching Data: ${err.statusText}`)
      })
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
        relation1: newRelation1,
        id_pseudo2: otherUserPseudo,
        relation2: newRelation2
      })
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          if (res.status === 403)
            alert("You are banned from this website")
          navigate("/login")
        }
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
    })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          if (res.status === 403)
            alert("You are banned from this website")
          navigate("/login")
        }
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
    getFriendRequest()
  }, [])

  const handleAccept = async (friend: IUser) => {
    await updateRelation(friend.id_pseudo, 3, 3)
    const newArray = requestArray.filter(function (item) {
      return item !== friend;
    })
    if (newArray.length === 0)
      handleClose()
    else
      setRequestArray(newArray)
  }

  const handleRefuse = async (friend: IUser) => {
    //Mm chose mais avec un status different 
    await removeRelation(friend.id_pseudo)
    const newArray = requestArray.filter(function (item) {
      return item !== friend;
    })
    setRequestArray(newArray)
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
        {(requestArray && requestArray.length) ?
          <Box sx={style}>
            <Grid container sx={request}>
              {requestArray.map((user: IUser) =>
                <Fragment key={user.id}>
                  < Grid item xs={3}>
                    <Avatar sx={{
                      margin: "auto",
                      width: "50px",
                      height: "50px"
                    }} src={user.avatar} />
                  </Grid>
                  <Grid item xs={2}> {user.id_pseudo} </Grid>
                  <Grid item xs={2}>
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => handleAccept(user)}>Accept
                    </Button>
                  </Grid>
                  <Grid item xs={2}>
                    <Button
                      size="small"
                      variant="contained"
                      color="warning"
                      onClick={() => handleRefuse(user)}>Refuse
                    </Button>
                  </Grid>
                </Fragment>
              )}
            </Grid>
          </Box>

          :
          <Box sx={style}>
            <Box sx={{
              padding: "5%",
              borderRadius: "5px",
              color: "rgba(250,250,250, 0.9)",
              bgcolor: "rgba(30, 30, 30, 0.9)",
              margin: "auto"
            }}>
              <Typography variant="body1">
                No Friend Request
              </Typography>
            </Box>
          </Box>
        }

      </Modal>
    </Fragment >
  );
}