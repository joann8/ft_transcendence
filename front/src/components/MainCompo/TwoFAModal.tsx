import { Modal } from "@mui/material";
import { useNavigate } from "react-router";

// TODO:
//

export default function TwoFAModal(props: any) {
  const handleClose = () => props.setModal(false);
  const nav = useNavigate();

  //<Modal open={props.modalState} onClose={handleClose} />
  return <div></div>;
}
