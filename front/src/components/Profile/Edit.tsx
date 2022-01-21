import { BottomNavigation, Box, Button, Grid, Paper, TextField, Toolbar } from "@mui/material";
import { flexbox } from "@mui/system";
import Reac, { Fragment, useState } from "react";

const editLayout = {
    justifyContent: "center",
    alignItems: "center",
    marginTop: "20px",
    overflow: "auto"
}

export default function Edit(props: any) {

    const [state, setState] = useState({
        pseudo: "",
        email: "",
    }
    )

    function handleChange(evt: any) {
        setState({
            ...state, [evt.target.name]: evt.target.value
        })
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
            <Grid container columns={12} spacing={2} style={editLayout}>
                <br />
                <Grid item xs={6}>

                    <TextField
                        fullWidth
                        id="outlined"
                        name="pseudo"
                        label="Pseudo"
                        defaultValue={state.pseudo}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item xs={6}>
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
                        }} onClick={props.handleClose}> Cancel </Button >
                    </BottomNavigation>
                </Grid>
            </Grid>

        </Fragment>
    );
}