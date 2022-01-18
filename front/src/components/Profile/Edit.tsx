import { BottomNavigation, Box, Button, Grid, Paper, TextField, Toolbar } from "@mui/material";
import { flexbox } from "@mui/system";
import Reac, { Fragment, useState } from "react";

const layout = {
    backgroundOriring: "center",
    display: "flex",
    alignItems: "center",
    width: "60vw",
    height: "80vh",

    marginTop: "10%",
    marginLeft: "10%",
    marginRight: "10%",
    overflow: "auto"
}

export default function Edit() {

    const [state, setState] = useState({

        pseudo: "Pseudo",
        currentPass: "Current Password",
        newPass: "New Password",
        confirmPass: "Confirm Password"
    }
    )

    function handleChange(evt: any) {
        setState({
            ...state, [evt.target.name]: evt.target.value})
    }

    function handleClick() {
        console.log(state)
        const userNewInfo = state;
        //Verification du password
        //Verification de la validites des champs recu
        //POST --> Modifier user
        console.log(userNewInfo);
    }
    
    return (
        <Fragment>
            <Grid container spacing={4} style={layout}>
                <br />
                <Grid item xs={12}>

                    <TextField

                        id="outlined"
                        name="pseudo"
                        label="Pseudo"
                        defaultValue={state.pseudo}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id="outlined"
                        name="currentPass"
                        label="Current Password"
                        defaultValue={state.currentPass}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField

                        id="outlined"
                        name="newPass"
                        label="New Password"
                        defaultValue={state.newPass}
                        onChange={handleChange}

                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField

                        id="required"
                       name="confirmPass"
                        label="Confirm Password"
                        defaultValue={state.confirmPass}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={handleClick}> Accept </Button>

                </Grid>
                <Grid item xs={6}>
                    <Button> Cancel </Button>
                </Grid>
            </Grid>

        </Fragment>);
}