type Message = {
  user: string;
  content: string;
  hour: string;
};
type CurrentChatProps = {
  messageList: Message[];
  innerref: React.MutableRefObject<HTMLDivElement | null>;
};
type MessageProps = {
  key: number;
  message: Message;
};
type MessagePostProps = {
  submit: (message: Message) => void;
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
  CurrentChatProps,
  MessageProps,
  ThemeOptions,
  MessagePostProps,
};
