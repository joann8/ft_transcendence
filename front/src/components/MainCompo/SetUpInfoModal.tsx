import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Fragment, useContext, useEffect, useState } from 'react';
import { Grid, TextField, BottomNavigation, IconButton, Avatar, styled, MobileStepper, useTheme } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, PhotoCamera, SentimentSatisfiedOutlined } from '@mui/icons-material';
import { Context } from './SideBars';
import { useNavigate } from 'react-router';
import validator from 'validator'


const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
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
    justifyContent: "space-evenly",
    alignItems: "center",
}


export default function SetUpInfoModal(props: any) {

    const context = useContext(Context)

    const [avatar, setAvatar] = useState(null)
    const [pseudo, setPseudo] = useState("")
    const [activeStep, setActiveStep] = useState(0);


    const nav = useNavigate()

    const handleClose = () => props.setModal(false);

    //INTERNAL COMPONENT
    //END BUTTON
    function EndDisplay() {

        const updateAvatar = async () => {
            if (avatar) {
                const formData = new FormData()
                formData.append("avatar", avatar, avatar.name)
                const response = await fetch("http://127.0.0.1:3001/user/upload", {
                    method: "POST",
                    credentials: "include",
                    referrerPolicy: "same-origin",
                    body: formData
                })
                    .then(res => {
                        if (!res.ok)
                            throw new Error(res.statusText)
                    })
                    .catch(err => {
                        throw new Error(`Avatar Upload Failed : [${err}]`)
                    })
            }
        }

        const updatePseudo = async () => {

            if(!pseudo)
            {
                throw new Error("Pseudo cannot be empty")
                return
            }
            if (pseudo) {
                if (!(validator.isAlpha(pseudo[0]) && validator.isAlphanumeric(pseudo)))
                    throw new Error("Pseudo must contain alpha numeric only and START with a letter")
            }

            const updatePseudo = {
                id_pseudo: pseudo
            }

            await fetch("http://127.0.0.1:3001/user", {
                method: "PUT",
                credentials: "include",
                referrerPolicy: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatePseudo),
            })
                .then(res => {
                    if (res.status === 401) {
                        nav("/login")
                    }
                    else if (!res.ok) {
                        if (res.status === 409)
                            throw new Error("Pseudo not available")
                        else
                            throw new Error(res.statusText)
                    }
                })
                .catch(err => {
                    throw new Error(`Update Pseudo Failed : [${err}]`)
                })
        }

        const handleCompleteRegistration = async () => {
            try {
                await updateAvatar()
                await updatePseudo()
            }
            catch (error) {
                alert(`Please Re-enter info : ${error}`)
                return
            }
            setActiveStep(0)
            context.setUpdate(!context.update)
            handleClose()
        }

        return (
            <Fragment>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center"
                }}>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleCompleteRegistration}>
                        Finish Registration
                    </Button>
                </Box>
            </Fragment>
        )
    }

    //EDIT PSEUDO 
    function InfoDisplay() {

        function handleChange(evt: any) {
            setPseudo(evt.target.value)
        }

        function handleSubmit(evt: any) {
            evt.preventDefault()
            setActiveStep((prevActiveStep) => prevActiveStep + 1);
        }

        return (
            <Fragment>
                <Box component="form" onSubmit={handleSubmit} 
                sx={{
                    display : "flex",
                    justifyContent : "center",
                }}>
                    <TextField
                        autoFocus
                        name="id_pseudo"
                        label="Pseudo"
                        defaultValue={pseudo}
                        onChange={handleChange}
                        sx={{
                            maxWidth: "400px",
                            flexGrow: 1
                        }}
                    />
                </Box>
            </Fragment>
        )
    }

    //EDIT AVATAR
    function AvatarDisplay() {
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
            <Fragment>
                <Grid container columns={12} spacing={2} style={editLayout}>
                    <Grid item xs={4} >
                        <Avatar src={avatar ? URL.createObjectURL(avatar) : context.user.avatar} style={{
                            minWidth: "100px",
                            minHeight: "100px",
                            flexGrow: 1,
                            border: "3px solid purple"
                        }} />
                    </Grid>
                    <Grid item xs={6}>
                        <label htmlFor="contained-button-file">
                            <Input accept="image/*" id="contained-button-file" type="file"
                                onChange={(event) => handleFileReception(event)} />
                            <Button variant="contained" component="span" startIcon={<PhotoCamera />} style={{
                                marginTop: "10px",
                                marginRight: "5px",
                                marginLeft: "5px",
                            }} >
                                Upload
                            </Button>
                        </label>
                    </Grid>
                </Grid>
            </Fragment>
        )
    }


    //STEPPER
    function DotsMobileStepper() {
        const theme = useTheme();

        const handleNext = () => {
            setActiveStep((prevActiveStep) => prevActiveStep + 1);

        };

        const handleBack = () => {
            setActiveStep((prevActiveStep) => prevActiveStep - 1);
        };

        return (
            <MobileStepper
                variant="dots"
                steps={3}
                position="static"
                activeStep={activeStep}
                sx={{
                    bgcolor: "rgba(200, 200, 200, 0.9)",
                    maxWidth: 400,
                    flexGrow: 1
                }}
                nextButton={
                    <Button size="small" onClick={handleNext} disabled={activeStep === 2}>
                        Next
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowLeft />
                        ) : (
                            <KeyboardArrowRight />
                        )}
                    </Button>
                }
                backButton={
                    <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
                        {theme.direction === 'rtl' ? (
                            <KeyboardArrowRight />
                        ) : (
                            <KeyboardArrowLeft />
                        )}
                        Back
                    </Button>
                }
            />
        );
    }

    //MODAL RENDERING
    return (
        <div>
            <Modal
                open={props.modalState}
                onClose={handleClose/*() => /*alert("Sorry, you must finished the registration process")*/ }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container spacing={3} >
                        <Grid item xs={12}>
                            {activeStep === 0 ? <AvatarDisplay /> : ""}
                            {activeStep === 1 ? <InfoDisplay /> : ""}
                            {activeStep === 2 ? <EndDisplay /> : ""}
                        </Grid>
                        <Grid item xs={12}>
                            <BottomNavigation>
                                <DotsMobileStepper />
                            </BottomNavigation>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </div >
    );
}
