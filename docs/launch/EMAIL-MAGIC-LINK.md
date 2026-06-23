# E-mail do Magic Link — O Sovina

> Primeira impressão do produto no login. Tom: imponente e sóbrio (no login o
> Sovina ainda não conhece a pessoa — impõe, não hostiliza). Sem emoji, brutalista.

## Onde colar (passo a passo) — `[VOCÊ]`
1. Supabase Dashboard → projeto **Sovina** (`yczkwfpuqqwpvdmuptpx`).
2. **Authentication → Emails → Templates → Magic Link**.
3. **Subject:** cole o assunto abaixo.
4. **Message body (Source/HTML):** cole o HTML abaixo (substitui o template padrão).
5. Salvar. (Opcional: em **Auth → Providers → Email**, conferir o OTP expiry — o app diz "10 minutos"; pra bater, setar `OTP expiry` = 600s.)

> Variável usada: `{{ .ConfirmationURL }}` (o link de acesso que o Supabase injeta).

---

## Subject
```
Seu acesso ao tribunal
```

## HTML (Message body)
```html
<!DOCTYPE html>
<html lang="pt-BR">
  <body style="margin:0;padding:0;background-color:#0D0D0D;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0D0D0D;">
      <tr>
        <td align="center" style="padding:48px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;">

            <!-- marca -->
            <tr>
              <td style="padding-bottom:32px;">
                <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:13px;letter-spacing:4px;text-transform:uppercase;color:#FFB300;">
                  O Sovina
                </p>
              </td>
            </tr>

            <!-- headline -->
            <tr>
              <td style="padding-bottom:16px;">
                <h1 style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;text-transform:uppercase;color:#FAFAFA;font-weight:700;">
                  O tribunal está aberto.
                </h1>
              </td>
            </tr>

            <!-- corpo -->
            <tr>
              <td style="padding-bottom:32px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#A3A3A3;">
                  Você pediu para entrar. Aqui está a porta. O link abre uma única
                  vez e esfria rápido — não me faça esperar.
                </p>
              </td>
            </tr>

            <!-- botão -->
            <tr>
              <td style="padding-bottom:28px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:#FFB300;">
                      <a href="{{ .ConfirmationURL }}"
                         style="display:inline-block;padding:16px 32px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:700;letter-spacing:0.3px;color:#0D0D0D;text-decoration:none;text-transform:uppercase;">
                        Entrar no tribunal
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- fallback -->
            <tr>
              <td style="padding-bottom:40px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6B6B6B;">
                  Se o botão não funcionar, cole este endereço no navegador:<br />
                  <a href="{{ .ConfirmationURL }}" style="color:#FFB300;word-break:break-all;">{{ .ConfirmationURL }}</a>
                </p>
              </td>
            </tr>

            <!-- rodapé -->
            <tr>
              <td style="border-top:1px solid #262626;padding-top:24px;">
                <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#6B6B6B;">
                  Não pediu este acesso? Ignore. Ninguém entra sem ser chamado.
                  Este e-mail não aceita resposta.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## Versão texto-puro (fallback, opcional)
Alguns clientes pedem uma versão plain-text. Se o Supabase oferecer o campo:
```
O SOVINA — O tribunal está aberto.

Você pediu para entrar. Aqui está a porta. O link abre uma única vez e esfria
rápido — não me faça esperar.

Entrar: {{ .ConfirmationURL }}

Não pediu este acesso? Ignore. Ninguém entra sem ser chamado.
```
