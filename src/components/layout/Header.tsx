import { SidebarTrigger } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { NotificacoesDropdown } from "@/components/notificacoes/NotificacoesDropdown";

export function Header() {
  const { profile, signOut } = useAuth();

  const initials = profile?.nome_completo ?
  profile.nome_completo.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase() :
  "U";

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-border bg-card/80 px-4 backdrop-blur-md">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />

      <div className="ml-auto flex items-center gap-3">
        <NotificacoesDropdown />

        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} alt={profile?.nome_completo || "Avatar"} />}
            <AvatarFallback className="gradient-primary text-xs font-bold text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <Badge variant="outline" className="hidden text-[10px] font-mono sm:inline-flex">
            v1.0
          </Badge>
        </div>

        <button
          onClick={signOut}
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          title="Sair">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
