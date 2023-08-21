import { Icon } from "@/Components/Icons"

interface SidebarOptions {
    id: number
    name: string
    href: string
    Icon: Icon
}

interface FriendsWithLastMessage {
    lastMessage: Message | undefined
    name: string
    email: string
    image: string
    id: string;
  }