import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refresh do token da sessão a cada navegação. Sem isto, Server Components
// veem sessão expirada e fazem auth.getUser() retornar null mesmo com o
// cookie ainda válido no client.
export async function proxy(request: NextRequest) {
  // Modo waitlist (pré-lançamento): só a landing pública fica acessível.
  // Bloqueia o app, o login e o callback de auth até o lançamento.
  if (process.env.LAUNCH_MODE === "waitlist") {
    const { pathname } = request.nextUrl;
    if (
      pathname.startsWith("/app") ||
      pathname.startsWith("/login") ||
      pathname.startsWith("/auth")
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  await supabase.auth.getUser();
  return response;
}

export const config = {
  matcher: [
    // Tudo exceto static, _next, imagens, e webhooks (que validam assinatura própria)
    "/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/whatsapp/inbound|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
