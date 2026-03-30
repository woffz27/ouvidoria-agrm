import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROTECTED_EMAIL = "emanuellleandro15@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const anonClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await anonClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const callerId = claimsData.claims.sub;
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Forbidden: admin only" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET — list all users
    if (req.method === "GET") {
      const { data: users, error: usersError } =
        await adminClient.auth.admin.listUsers({ perPage: 1000 });
      if (usersError) throw usersError;

      const { data: profiles } = await adminClient.from("profiles").select("*");
      const { data: roles } = await adminClient.from("user_roles").select("*");

      const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
      const roleMap = new Map<string, string[]>();
      for (const r of roles || []) {
        const existing = roleMap.get(r.user_id) || [];
        existing.push(r.role);
        roleMap.set(r.user_id, existing);
      }

      const result = users.users.map((u: any) => {
        const profile = profileMap.get(u.id);
        return {
          id: u.id,
          email: u.email,
          nome_completo: profile?.nome_completo || "",
          cargo: profile?.cargo || "",
          roles: roleMap.get(u.id) || [],
          aprovado: profile?.aprovado ?? false,
          created_at: u.created_at,
        };
      });

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — actions
    if (req.method === "POST") {
      const body = await req.json();
      const { action, user_id } = body;

      if (!action || !user_id) {
        return new Response(
          JSON.stringify({ error: "action and user_id required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { data: targetUser } = await adminClient.auth.admin.getUserById(user_id);

      if (action === "approve_user") {
        await adminClient
          .from("profiles")
          .update({ aprovado: true })
          .eq("id", user_id);
        return new Response(JSON.stringify({ message: "User approved" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "toggle_role") {
        if (targetUser?.user?.email === PROTECTED_EMAIL) {
          const { data: existingRole } = await adminClient
            .from("user_roles")
            .select("id")
            .eq("user_id", user_id)
            .eq("role", "admin")
            .maybeSingle();

          if (existingRole) {
            return new Response(
              JSON.stringify({ error: "Não é possível remover o admin principal" }),
              { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
        }

        const { data: existing } = await adminClient
          .from("user_roles")
          .select("id")
          .eq("user_id", user_id)
          .eq("role", "admin")
          .maybeSingle();

        if (existing) {
          await adminClient.from("user_roles").delete().eq("id", existing.id);
          return new Response(JSON.stringify({ message: "Admin role removed" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        } else {
          await adminClient
            .from("user_roles")
            .insert({ user_id, role: "admin" });
          return new Response(JSON.stringify({ message: "Admin role added" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }

      if (action === "update_avatar") {
        const { avatar_url } = body;
        await adminClient
          .from("profiles")
          .update({ avatar_url: avatar_url || null })
          .eq("id", user_id);
        return new Response(JSON.stringify({ message: "Avatar updated" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (action === "delete_user") {
        if (targetUser?.user?.email === PROTECTED_EMAIL) {
          return new Response(
            JSON.stringify({ error: "Não é possível excluir o admin principal" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        if (user_id === callerId) {
          return new Response(
            JSON.stringify({ error: "Não é possível excluir sua própria conta" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }

        const { error: deleteError } = await adminClient.auth.admin.deleteUser(user_id);
        if (deleteError) throw deleteError;

        return new Response(JSON.stringify({ message: "User deleted" }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ error: "Unknown action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
