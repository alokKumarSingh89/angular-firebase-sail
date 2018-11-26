export class Conversation {
  $key?: string;
  appyID: string;
  createdBy: string;
  createdTime: number;
  iconURL: string;
  imageUrl: string[];
  lastMessage: string;
  name: string;
  desc?:string;
  participantsCS: string;
  isGroupChat: boolean;
}

