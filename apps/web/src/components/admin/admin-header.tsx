import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Bell, User } from "lucide-react";

export function AdminHeader() {
  return (
    <header className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold">Content Management</h2>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        <ModeToggle />
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
