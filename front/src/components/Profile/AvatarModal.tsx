import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord } from 'dns';
import { useEffect, useState } from 'react';
import { Grid, TextField, BottomNavigation, IconButton, styled } from '@mui/material';
import { PhotoCamera, SentimentSatisfiedOutlined } from '@mui/icons-material';
import { alterHsl } from 'tsparticles';

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
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    p: 4,
};


const Input = styled('input')({
    display: 'none',
});

export default function AvatarModal(props: any) {

    const editLayout = {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        overflow: "auto"
    }

    const [avatar, setAvatar] = useState(null)

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
                    console.log("Avatar send. Response : ", res )
                 //   props.setUpdate(props.update + 1)
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
                        <Grid item xs={4}>
                        </Grid>
                        <Grid item xs={4}>
                            <label htmlFor="contained-button-file">
                                <Input accept="image/*" id="contained-button-file" type="file"
                                    onChange={(event) => handleFileReception(event)} />
                                <Button variant="contained" component="span" startIcon={<PhotoCamera />}>
                                    Upload avatar
                                </Button>
                            </label>
                        </Grid>
                        <Grid item xs={4}>

                        </Grid>
                        <Grid item xs={12}>
                            <BottomNavigation >
                                <Button variant="contained" style={{
                                    backgroundColor: "#22c863",
                                    color: "#FFFFFF",
                                    minWidth: "30%",
                                    marginLeft: "5%",
                                    marginTop: "10px",
                                    marginRight: "5%",
                                    overflow: "auto"
                                }} onClick={handleUpload}> Confirm Avatar</Button>

                                <Button variant="contained" style={{
                                    backgroundColor: "#c84322",
                                    marginLeft: "5%",
                                    marginTop: "10px",
                                    marginRight: "5%",
                                    color: "#FFFFFF",
                                    width: "30%"
                                }} onClick={handleClose}> Cancel </Button >
                            </BottomNavigation>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div>
    );
}