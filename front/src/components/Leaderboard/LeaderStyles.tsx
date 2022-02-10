import Image from '../Images/pig.jpg'

const leaderStyles = {
    backgroundImage: {
      backgroundImage: `url(`+ `${Image}` + ')',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      width: '100%',
      height: '100%',
      overflow: 'auto',
    },
};

export default leaderStyles;