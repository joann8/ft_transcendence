import Image from '../Images/game.jpg'

const gameStyles = {
    backgroundImage: {
      backgroundImage: `url(${Image})`,
      backgroundPosition: 'left',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
    boxModal: {
      align: 'center',
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 'auto',
      height: 'auto',
      bgcolor: "#FFFFFF",
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
      display: 'inline'
    },
    gameWindow: {
        width: "98%",
        height: "70vh",
        backgroundColor: "yellow",
        textAlign: "center",
        FormatAlignJustify: "center"
      }
};

export default gameStyles;