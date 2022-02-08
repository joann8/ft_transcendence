import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord } from 'dns';
import { useContext, useEffect, useState } from 'react';
import { Grid, TextField, BottomNavigation, IconButton, styled, Avatar } from '@mui/material';
import { PhotoCamera, SentimentSatisfiedOutlined } from '@mui/icons-material';
import { alterHsl } from 'tsparticles';
import { Context } from './SideBars';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "85%",
    height: "30%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    overflow: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    p: 4,
};


const Input = styled('input')({
    display: 'none',
});

const editLayout = {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    overflow: "auto"
}

export default function AvatarModal(props: any) {



    const [avatar, setAvatar] = useState(null)

    const context = useContext(Context)
    const handleClose = () => props.setModal(false);


    //Confirm le changement d'avatar
    const handleUpload = async () => {
        if (avatar) {

            console.log("avatar: ", avatar)
            const formData = new FormData()
            formData.append("avatar", avatar, avatar.name)
            console.log("formData: ", formData.get("myAvatar"))


            const response = await fetch("http://127.0.0.1:3001/user/upload", {
                method: "POST",
                credentials: "include",
                referrerPolicy: "same-origin",
                body: formData
            })
                .then(res => {
                    if (!res.ok)
                        throw new Error(res.statusText)
                    console.log("Avatar send. Response : ", res)
                    context.setUpdate(!context.update)
                    props.setModal(false)
                })
                .catch(error => {
                    alert(error)
                })
        }
        else
            alert("Error : You must upload an avatar")
    }


    //Recupere la file suite a l'ouverture auto de la fenetre d'upload
    const handleFileReception = event => {
        if (event.target.files[0].size > 15000000)
            return alert("Error : Avatar file size >= 15 Mb")
        const fileName = event.target.files[0].name
        const extName = fileName.split(".").pop()
        if (extName !== 'jpeg' && extName !== 'jpg' && extName !== 'png'
            && extName !== 'gif')
            return alert("jpeg | jpg | png | gif File only")
        setAvatar(event.target.files[0])
        console.log("Uploaded Avatar : ", event.target.files[0])
        console.log("Url Avatar Object : ", URL.createObjectURL(event.target.files[0]))
    }

    return (
        <div>
            <Modal
                open={props.modalState}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container columns={12} spacing={2} style={editLayout}>

                        <Grid item xs={4} >
                            <Avatar src={ avatar ? URL.createObjectURL(avatar) : "" } style={{
                                width: "125px",
                                height: "125px",
                                border:"3px solid purple"
                            }} /> 
                        </Grid>
                        <Grid container item xs={12} style={{justifyContent:"space-around"}}>
                            <Grid item xs={6} >
                                <Button variant="contained" style={{
                                    backgroundColor: "#22c863",
                                    color: "#FFFFFF",
                                    minWidth: "30%",
                                    marginLeft: "5%",
                                    marginTop: "10px",
                                    overflow: "auto"
                                }} onClick={handleUpload}> Confirm Avatar
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <label htmlFor="contained-button-file">
                                    <Input accept="image/*" id="contained-button-file" type="file"
                                        onChange={(event) => handleFileReception(event)} />
                                    <Button variant="contained" component="span" startIcon={<PhotoCamera />} style={{
                                        minWidth: "30%",
                                        marginTop: "10px",
                                        marginRight: "5%",
                                        overflow: "auto"
                                    }} >
                                        Upload Picture
                                    </Button>
                                </label>
                            </Grid>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}