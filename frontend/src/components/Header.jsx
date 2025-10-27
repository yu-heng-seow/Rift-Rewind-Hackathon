import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator
} from "@/components/ui/menubar"; 

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full flex items-center justify-between px-6 py-2 bg-none">
      {/* Left: Logo */}
      <div className="flex items-center">
        <h1 className="text-lg font-bold text-white">Rift Rewind</h1>
      </div>

      {/* Center: Menubar */}
      <div className="flex-1 flex justify-center">
        <Menubar className="bg-black/20 shadow-none border-none">
          <MenubarMenu>
            <MenubarTrigger>Overview</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Dashboard</MenubarItem>
              <MenubarItem>Stats</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Highlights</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Achievements</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Top Champions</MenubarItem>
              <MenubarItem>Game Milestones</MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger>Others</MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Right: Avatar */}
      <div className="flex items-center">
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://ddragon.leagueoflegends.com/cdn/14.20.1/img/profileicon/588.png" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
