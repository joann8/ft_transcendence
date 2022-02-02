import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord } from 'dns';
import { useEffect, useState } from 'react';
import { Grid, TextField, BottomNavigation, alertTitleClasses } from '@mui/material';
import validator from 'validator'
import { useNavigate } from 'react-router';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "85%",
    height: "70%",
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function InfoModal(props: any) {

    const editLayout = {
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        overflow: "auto"
    }

    const [state, setState] = useState({
        id_pseudo: "",
        email: "",
    })
    const [modal, setModal] = useState(true)
    const nav = useNavigate()


    function handleChange(evt: any) {
        setState({
            ...state, [evt.target.name]: evt.target.value
        })
    }

    function handleClick() {

        if (!state.email && !state.id_pseudo) {
            alert("Empty Fields : No change to submit")
            return;
        }
        if (state.email) {
            if (!validator.isEmail(state.email))
                return alert("Email Invalid")
        }
        if (state.id_pseudo) {
            if (!(validator.isAlpha(state.id_pseudo[0]) && validator.isAlphanumeric(state.id_pseudo)))
                return (alert("Pseudo must contain alpha numeric only and START with a letter"))
        }
        let update: any
        update = {}
        if (state.email)
            update.email = state.email
        if (state.id_pseudo)
            update.id_pseudo = state.id_pseudo

        fetch("http://127.0.0.1:3001/user", {
            method: "PUT",
            credentials: "include",
            referrerPolicy: "same-origin",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(update),
        })
            .then(res => {
                if (res.status === 401) {
                    nav("/login")
                }

                else if (!res.ok) {
                    throw new Error(res.statusText)
                }
                res.json()
            })
            .then(data => {
                console.log(data)
                props.setUpdate(props.update + 1)
                props.setModal(false)
            })
            .catch(err => {
                alert(err)
            })
    }

       //             {/*open={props.modalState}*/}

    const handleClose = () => setModal(false)//props.setModal(false);

    return (
        <div>
            <Modal
                open={modal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Grid container columns={12} spacing={2} style={editLayout}>
                        <br />
                        <Grid item xs={6}component="form">

                            <TextField
                                fullWidth
                                id="outlined"
                                name="id_pseudo"
                                label="Pseudo"
                                defaultValue={state.id_pseudo}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={6} component="form">
                            <TextField
                                fullWidth
                                id="outlined"
                                name="email"
                                label="New Email"
                                defaultValue={state.email}
                                onChange={handleChange}

                            />
                        </Grid>
                        <Grid item xs={12}>
                            <BottomNavigation >
                                <Button variant="contained" style={{
                                    backgroundColor: "#22c863",
                                    color: "#FFFFFF",
                                    width: "30%",
                                    marginLeft: "5%",
                                    marginTop: "10px",
                                    marginRight: "5%",
                                }} onClick={handleClick}> Accept </Button>

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