import backGround from "./../Images/complex_logos.jpg";

export interface IRelation {
  userId1: number;
  userId2: number;
  relation1: number;
  relation2: number;
}

export interface IUser {
  id: number;
  id_pseudo: string;
  email: string;
  avatar: string;
  role: string;
  elo: number;
  status: string;
  two_factor_enabled: boolean;
  achievement1: boolean;
  achievement2: boolean;
}

const profileStyle = {
  layout: {
    backgroundImage: `url(` + `${backGround}` + ")",
    backgroundPosition: "center",
    backgroundRepeat: "repeat",
    backgroundSize: "cover",
    width: "100vw",
    height: "100vh",
    display: "flex",
    overflow: "auto",
  },
  boxStyle: {
    position: "relative",
    backgroundPosition: "center",
    display: "flex",
    margin: "auto",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  container: {
    position: "relative",
    minWidth: "50%",
    minHeight: "50%",
    padding: "2",
    margin: "10px",
    display: "grid",
    alignItems: "center",

  },
  searchBar: {
    positon: "relative",
    backgroundOrigin: "center",
  },
  profileBlock: {
    positon: "relative",
    gridAutoFlow: "column",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    padding: "20px 10px",
    display: "grid",
    justifyContent: "space-around",
    border: "2px solid rgba(150, 150, 150, 1)",
    overflow: "scroll"
  },
  matchHistory: {
    positon: "relative",
    backgroundOrigin: "center",
  },
  middleBox: {
    position: "relative",
    backgroundColor: "rgba(0,0,0, 0.5)",
    color: "rgba(255,255,255,1)",
    padding: "10px",
    margin: "20px",
    display: "grid",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "15px",
    border: "1.5px solid rgba(150, 150, 150, 0.3)",
  },
  leftRightBox: {
    margin: "20px",
    display: "grid",
    justifyContent: "center",
    aligItems: "baseline",
  },
  text: {
    marginTop: "5px",
    marginBottom: "5px"
  },
  divider: {
    height: "50%",
    margin: "auto",
    backgroundColor: "rgba(150, 150, 150, 1)",
  }
};

export default profileStyle;
