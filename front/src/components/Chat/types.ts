/**
 *  BACK TYPE
 */
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

type User = {
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
};

type Channel = {
  id: number;
  name: string;
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
};
type MessageListProps = {
  messageList: Message[];
  innerref: React.MutableRefObject<HTMLDivElement | null>;
  submit: (content: string) => void;
};
type MessageProps = {
  key: number;
  message: Message;
};
type MessagePostProps = {
  submit: (content: string) => void;
};
type ChannelListProps = {
  currentChannel: Channel;
  changeChannel: React.Dispatch<React.SetStateAction<Channel>>;
  fetchChannelList: () => Promise<void>;
  channelList: Channel[];
};
type CreateChannelProps = {
  fetchChannelList: () => Promise<void>;
};
type RoleListProps = {
  currentChannel: Channel;
  roleList: userChannelRole[];
  fetchUsers: () => Promise<void>;
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
};
