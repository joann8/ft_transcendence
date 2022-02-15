import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Fragment, useContext, useState } from 'react';
import { Grid, TextField, BottomNavigation, Avatar, styled, MobileStepper, useTheme, Paper } from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight, PhotoCamera } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import validator from 'validator'
import registrationBg from "../Images/registrationBg.jpg"
import { Context } from './SideBars';
import { api_url } from '../../ApiCalls/var';


const style = {
  position: 'relative',
  top: '55%',
  left: '55%',
  maxHeight: "40vh",
  maxWidth: "50vw",
  transform: 'translate(-50%, -50%)',
  bgcolor: 'rgba(250, 250, 250)',
  border: '2px solid #000',
  display: "flex",
  justifyContent: "center",
  //  alignItems: "center",
  overflow: "auto",
  p: 4,
};


const Input = styled('input')({
  display: 'none',
});

const editLayout = {
  justifyContent: "center",
  alignItems: "center",
}


export default function EditPage() {

  const context = useContext(Context)
  const [avatar, setAvatar] = useState(null)
  const [pseudo, setPseudo] = useState("")
  const [activeStep, setActiveStep] = useState(0);

  const navigate = useNavigate()

  //EDIT PSEUDO 
  function InfoDisplay() {

    function handleChange(evt: any) {
      setPseudo(evt.target.value)
    }

    const updatePseudo = async () => {

      if (!pseudo) {
        throw new Error("Pseudo cannot be empty")
      }
      if (pseudo) {
        if (!(validator.isAlpha(pseudo[0]) && validator.isAlphanumeric(pseudo)))
          throw new Error("Pseudo must contain alpha numeric only and START with a letter")
      }

      const updatePseudo = {
        id_pseudo: pseudo
      }

      await fetch(api_url + "/user", {
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
            navigate("/login")
          }
          else if (!res.ok) {
            if (res.status === 409)
              throw new Error("Pseudo not available")
            else
              throw new Error(res.statusText)
          }
        })
    }
    const handleSubmit = async (evt: any) => {
      evt.preventDefault()
      try {
        await updatePseudo()
      }
      catch (error) {
        alert(`${error}`)
        return
      }
      context.setUpdate(!context.update)
    }

    return (
      <Fragment>
        <Box component="form" onSubmit={handleSubmit}
          sx={{
            display: "flex",
            justifyContent: "center",
          }}>
          <TextField
            autoFocus
            name="id_pseudo"
            label="Pseudo"
            defaultValue={pseudo}
            onChange={handleChange}
            sx={{
              maxWidth: "400px",
              marginRight: "20px",
              flexGrow: 1
            }}
          />
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Confirm
          </Button>
        </Box>
      </Fragment>
    )
  }

  //EDIT AVATAR
  function AvatarDisplay() {



    const uploadAvatar = async () => {
      if (avatar) {
        const formData = new FormData()
        formData.append("avatar", avatar, avatar.name)
        const response = await fetch(api_url + "/user/upload", {
          method: "POST",
          credentials: "include",
          referrerPolicy: "same-origin",
          body: formData
        })
          .then(res => {
            if (res.status === 401) {
              navigate("/login")
            }
            else if (!res.ok)
              throw new Error(res.statusText)
          })
          .catch(err => {
            throw new Error(`Avatar Upload Failed : [${err}]`)
          })
      }
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

    const handleUpload = async () => {
      try {
        await uploadAvatar()
      }
      catch (error) {
        alert(`Avatar upload failed : ${error}`)
        return
      }
      context.setUpdate(!context.update)
    }


    return (
      <Fragment>
        <Grid container columns={12} spacing={2} style={editLayout}>
          <Grid item xs={4} sx={{ marginRight: "30px", }} >
            <Avatar src={avatar ? URL.createObjectURL(avatar) : context.user.avatar} style={{
              minWidth: "125px",
              minHeight: "125px",
              flexGrow: 1,
              border: "2px solid black "
            }} />
          </Grid>
          <Grid item xs={4}>
            <label htmlFor="contained-button-file">
              <Input accept="image/*" id="contained-button-file" type="file"
                onChange={(event) => handleFileReception(event)} />
              <Button variant="contained" component="span" startIcon={<PhotoCamera />} style={{
                marginBottom: "10px",
              }} >
                Upload
              </Button>
            </label>
            <Button variant="contained" color="success" onClick={handleUpload} >
              Confirm
            </Button>
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
        steps={2}
        position="static"
        activeStep={activeStep}
        sx={{
          bgcolor: 'rgba(50, 50, 50, 0.1)',
          maxWidth: "100%",
          flexGrow: 1
        }}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 1}>
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

  //COMPONENT RENDERING
  return (
    <Fragment>
      <Paper style={{
        backgroundImage: `url(${registrationBg})`,
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'cover',
        width: '100vw',
        height: '100vh',
        display: "flex",
        overflow: "auto"
      }}>
        <Box sx={style}>
          <Grid container spacing={3} >
            <Grid item xs={12} sx={{ alignSelf: "end" }}>
              {activeStep === 0 ? <AvatarDisplay /> : ""}
              {activeStep === 1 ? <InfoDisplay /> : ""}
            </Grid>
            <Grid item xs={12} sx={{ alignSelf: "end" }}>
              <BottomNavigation>
                <DotsMobileStepper />
              </BottomNavigation>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Fragment>
  );
}