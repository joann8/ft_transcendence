import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { AnyRecord } from 'dns';
import { useEffect } from 'react';

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

export default function MatchModal(props: any) {
    /*  const [modal, setModal] = React.useState(props.modalState);
      useEffect(() => {
          props.setModal(modal);
      }, [props.modalState])
      */


    const handleClose = () => props.setModal(false);

    return (
        <div>
            <Modal
                open={props.modalState}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            This is the AVATAR MODAL
                        </Typography>

                    </div>
                </Box>

            </Modal>
        </div>
    );
}