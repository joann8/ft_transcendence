import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord } from 'dns';
import { useEffect } from 'react';
import LoadingGif from '../Images/loadingGif.gif'

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

export default function LoadingModal(props: any) {
    /*  const [modal, setModal] = React.useState(props.modalState);
      useEffect(() => {
          props.setModal(modal);
      }, [props.modalState])
      */


    const handleClose = () => props.setLoaded(false);

    const handleLoading = () => props.setLoaded(true);

    return (
        <div>
            <Modal
                open={!props.loaded}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            This is the Loading MODAL
                        </Typography>
                        <Button variant="contained" onClick={handleLoading}> Loading FINISHED </Button>

                        
                        <img src={LoadingGif} alt="Loading the page"/>
                        <br/>

                    </div>
                </Box>

            </Modal>
        </div>
    );
}