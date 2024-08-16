import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";


const Header = () => {
  let user = false;

  const navigate = useNavigate();

  return (
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src="/logo.png" alt="logo-image" className="h-16" />
      </Link>

      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Anusha Panwar</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
              <LinkIcon className="mr-2 w-4 h-4" />
              <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
              <LogOut className="mr-2 w-4 h-4" />
              <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        )}
      </div>
    </nav>
  );
};

export default Header;
