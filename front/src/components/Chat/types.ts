import { Socket } from "socket.io-client";

/**
 *  BACK TYPE
 */

export enum channelType {
  PUBLIC,
  PRIVATE,
  DIRECT,
}

export enum status {
  OFFLINE = "OFFLINE",
  ONLINE = "ONLINE",
  IN_GAME = "IN GAME",
  BAN = "BAN",
}

export enum user_role {
  OWNER = "owner",
  ADMIN = "admin",
  USER = "user",
}
type Message = {
  id: number;
  content: string;
  channel: Channel;
  author: User;
  date: Date;
};

/*type User = {
  id: number;
  id_pseudo: string;
  avatar: string;
  email: string;
  role: user_role;
  elo: number;
  status: status;
  two_factor_enabled: boolean;
  two_factor_secret: string;
  refresh_token: string;
  achievement1: boolean;
  achievement2: boolean;
  roles: userChannelRole[];
};*/

interface User {
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

type Channel = {
  id: number;
  name: string;
  mode: channelType;
  password: string;
  messages: Message[];
  roles: userChannelRole[];
};
export enum channelRole {
  owner = "owner",
  admin = "admin",
  user = "user",
  banned = "banned",
  muted = "muted",
}
type userChannelRole = {
  id: number;
  user: User;
  channel: Channel;
  role: channelRole;
};

/**
 *   PROPS TYPE
 */

type MessagesProps = {
  messageList: Message[];
  innerref: React.MutableRefObject<HTMLDivElement | null>;
  currentUser: User;
};
type MessageListProps = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  currentChannel: Channel;
  currentUser: User;
};
type MessageProps = {
  key: number;
  message: Message;
  currentUser: User;
};
type MessagePostProps = {
  submit: (content: string) => void;
};
type ChannelListProps = {
  currentUser: User;
  currentChannel: Channel;
  changeChannel: React.Dispatch<React.SetStateAction<Channel>>;
  setChannelList: React.Dispatch<React.SetStateAction<Channel[]>>;
  fetchChannelList: () => Promise<void>;
  channelList: Channel[];
};
type CreateChannelProps = {
  fetchChannelList: () => Promise<void>;
};
type RoleListProps = {
  currentChannel: Channel;
  currentUser: User;
};
type AddUserProps = {
  currentChannel: Channel;

  fetchUsers: () => Promise<void>;
};
type ThemeOptions = {
  palette: {
    primary: {
      main: "string";
    };
  };
};

interface ServerToClientEvents {
  message: (channel: Channel, message: Message) => void;
  channelConnect: (channel: Channel) => void;
}
interface ClientToServerEvents {
  message: (user: User, channel: Channel, content: string) => void;
  channelConnect: (channel: Channel) => void;
}

export type {
  Message,
  MessagesProps,
  MessageProps,
  ThemeOptions,
  MessagePostProps,
  MessageListProps,
  ChannelListProps,
  RoleListProps,
  Channel,
  User,
  userChannelRole,
  CreateChannelProps,
  AddUserProps,
  ServerToClientEvents,
  ClientToServerEvents,
};
