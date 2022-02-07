import { Modal } from "@mui/material";
import { useNavigate } from "react-router";

// TODO:
//

export default function InfoModal(props: any) {
  const handleClose = () => props.setModal(false);
  const nav = useNavigate();

  return (
    <div>
      <Modal open={props.modalState} onClose={handleClose} />
    </div>
  );
}
