import { LogOut, Mail, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {useUser} from '@/context/UserContext';

export default function Navbar() {

  const {user, logout} = useUser();


  return (
    <nav className="w-full backdrop-blur-md bg-white/75 sticky top-0 px-4 lg:px-20 md:px-6 sm:px-4 z-50 border-b">
      <div className="container flex items-center justify-between py-4">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-pink-400" />
          <span className="font-bold text-xl text-shield-600">BotGuard</span>
        </Link>
        
        <div className="flex items-center gap-4">
          { user ? (
            <div className="flex gap-6">
              <div className="flex items-center gap-3 cursor-pointer group">
                <Avatar className="h-8 w-8">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                </Avatar>

                <div className="flex flex-col items-start">
                    <span className="font-medium text-sm">{user.name}</span>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                        <Mail className="h-3 w-3" />
                        <span>{user.email}</span>
                    </div>
                </div>
              </div>

              <Button className="bg-red-500 " onClick={logout}>
                  Logout <LogOut />
              </Button>
            </div>
          ) : (
            <>
              <Link to='/login'>
                <Button className="bg-blue-500 ">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}