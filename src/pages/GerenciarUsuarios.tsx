import { useEffect, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldOff, Trash2, Loader2, Users, CheckCircle2 } from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type UserItem = {
  id: string;
  email: string;
  nome_completo: string;
  cargo: string;
  roles: string[];
  aprovado: boolean;
  created_at: string;
};

export default function GerenciarUsuarios() {
  const { isAdmin, session } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.functions.invoke("manage-users", { method: "GET" });
      if (error) throw error;
      // Sort: pending first
      const sorted = (data || []).sort((a: UserItem, b: UserItem) => {
        if (a.aprovado === b.aprovado) return 0;
        return a.aprovado ? 1 : -1;
      });
      setUsers(sorted);
    } catch (err: any) {
      toast({ title: "Erro ao carregar usuários", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && session) fetchUsers();
  }, [isAdmin, session]);

  const approveUser = async (userId: string) => {
    try {
      setActionLoading(userId + "_approve");
      const { data, error } = await supabase.functions.invoke("manage-users", {
        method: "POST",
        body: { action: "approve_user", user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Usuário aprovado com sucesso!" });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Erro ao aprovar", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleRole = async (userId: string) => {
    try {
      setActionLoading(userId + "_role");
      const { data, error } = await supabase.functions.invoke("manage-users", {
        method: "POST",
        body: { action: "toggle_role", user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Permissão atualizada com sucesso" });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Erro ao alterar permissão", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      setActionLoading(userId + "_delete");
      const { data, error } = await supabase.functions.invoke("manage-users", {
        method: "POST",
        body: { action: "delete_user", user_id: userId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast({ title: "Usuário excluído com sucesso" });
      await fetchUsers();
    } catch (err: any) {
      toast({ title: "Erro ao excluir usuário", description: err.message, variant: "destructive" });
    } finally {
      setActionLoading(null);
    }
  };

  if (!isAdmin) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Acesso restrito a administradores.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">Gerenciar Usuários</h1>
        </div>

        <div className="rounded-lg border bg-card">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              {/* Mobile/Tablet: Cards */}
              <div className="block lg:hidden divide-y">
                {users.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">Nenhum usuário encontrado.</p>
                ) : (
                  users.map((user) => {
                    const isUserAdmin = user.roles.includes("admin");
                    return (
                      <div key={user.id} className={`p-4 space-y-3 ${!user.aprovado ? "bg-amber-50/50 dark:bg-amber-950/10" : ""}`}>
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">{user.nome_completo || "—"}</p>
                            <p className="text-xs text-muted-foreground break-all">{user.email}</p>
                            {user.cargo && <p className="text-xs text-muted-foreground mt-0.5">{user.cargo}</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1.5 shrink-0">
                            <Badge variant={user.aprovado ? "default" : "outline"} className={`text-[10px] ${!user.aprovado ? "border-amber-500 text-amber-600" : ""}`}>
                              {user.aprovado ? "Aprovado" : "Pendente"}
                            </Badge>
                            <Badge variant={isUserAdmin ? "default" : "secondary"} className="text-[10px]">
                              {isUserAdmin ? "Admin" : "Usuário"}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!user.aprovado && (
                            <Button variant="outline" size="sm" onClick={() => approveUser(user.id)} disabled={actionLoading === user.id + "_approve"} className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 gap-1.5 text-xs">
                              {actionLoading === user.id + "_approve" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />} Aprovar
                            </Button>
                          )}
                          <Button variant="outline" size="sm" onClick={() => toggleRole(user.id)} disabled={actionLoading === user.id + "_role"} className="gap-1.5 text-xs">
                            {actionLoading === user.id + "_role" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : isUserAdmin ? <ShieldOff className="h-3.5 w-3.5" /> : <Shield className="h-3.5 w-3.5" />}
                            {isUserAdmin ? "Remover admin" : "Tornar admin"}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-1.5 text-xs" disabled={actionLoading === user.id + "_delete"}>
                                {actionLoading === user.id + "_delete" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />} Excluir
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o acesso de{" "}
                                  <strong>{user.nome_completo || user.email}</strong>?
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Desktop: Table */}
              <div className="hidden lg:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Permissão</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => {
                      const isUserAdmin = user.roles.includes("admin");
                      return (
                        <TableRow key={user.id} className={!user.aprovado ? "bg-amber-50/50 dark:bg-amber-950/10" : ""}>
                          <TableCell className="font-medium">{user.nome_completo || "—"}</TableCell>
                          <TableCell className="text-muted-foreground">{user.email}</TableCell>
                          <TableCell>{user.cargo || "—"}</TableCell>
                          <TableCell>
                            <Badge variant={user.aprovado ? "default" : "outline"} className={!user.aprovado ? "border-amber-500 text-amber-600" : ""}>
                              {user.aprovado ? "Aprovado" : "Pendente"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isUserAdmin ? "default" : "secondary"}>
                              {isUserAdmin ? "Admin" : "Usuário"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {!user.aprovado && (
                                <Button variant="outline" size="sm" onClick={() => approveUser(user.id)} disabled={actionLoading === user.id + "_approve"} title="Aprovar cadastro" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                  {actionLoading === user.id + "_approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                </Button>
                              )}
                              <Button variant="outline" size="sm" onClick={() => toggleRole(user.id)} disabled={actionLoading === user.id + "_role"} title={isUserAdmin ? "Remover admin" : "Tornar admin"}>
                                {actionLoading === user.id + "_role" ? <Loader2 className="h-4 w-4 animate-spin" /> : isUserAdmin ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive" disabled={actionLoading === user.id + "_delete"} title="Excluir usuário">
                                    {actionLoading === user.id + "_delete" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Excluir usuário</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o acesso de{" "}
                                      <strong>{user.nome_completo || user.email}</strong>?
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUser(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {users.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhum usuário encontrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
