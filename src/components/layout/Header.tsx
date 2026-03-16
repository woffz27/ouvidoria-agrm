import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Search, Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export function Header() {
  const [protocolo, setProtocolo] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (protocolo.trim()) {
      navigate(`/buscar?q=${protocolo.trim()}`);
      setProtocolo("");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="h-5 w-px bg-border" />

      <form onSubmit={handleSearch} className="relative flex-1 min-w-0 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por protocolo (ex: 2025-000001)"
          value={protocolo}
          onChange={(e) => setProtocolo(e.target.value)}
          className="h-9 pl-9 text-sm bg-muted/50 border-transparent focus:border-primary/30 focus:bg-card"
        />
      </form>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground">
            3
          </span>
        </button>

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">
            A
          </div>
          <Badge variant="outline" className="hidden text-[10px] font-mono sm:inline-flex">
            v1.0
          </Badge>
        </div>
      </div>
    </header>
  );
}
