type chatRoom = {
  id: number;
  name: string;
  users: string[];
  messageList: {
    user: string;
    content: string;
    hour: string;
  }[];
};

type Message = {
  user: string;
  content: string;
  hour: string;
};
type MessagesProps = {
  messageList: Message[];
  innerref: React.MutableRefObject<HTMLDivElement | null>;
};
type CurrentChatProps = {
  messageList: Message[];
  innerref: React.MutableRefObject<HTMLDivElement | null>;
  submit: (message: Message) => void;
};
type MessageProps = {
  key: number;
  message: Message;
};
type MessagePostProps = {
  submit: (message: Message) => void;
};
type ChatRoomsProps = {
  currentIndex: number;
  changeRoom: (index: number) => void;
  chatRooms: chatRoom[];
};
type ThemeOptions = {
  palette: {
    primary: {
      main: "string";
    };
  };
};
export type {
  Message,
  MessagesProps,
  MessageProps,
  ThemeOptions,
  MessagePostProps,
  CurrentChatProps,
  ChatRoomsProps,
};
