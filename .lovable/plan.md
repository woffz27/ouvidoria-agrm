## Plano: Texto responsivo na página de Login

### O que será feito

Usar classes Tailwind responsivas (`text-xl md:text-2xl`, `text-xs md:text-sm`, etc.) nos textos da página de Login para que ajustem automaticamente ao tamanho da tela.

### Alterações em `src/pages/Login.tsx`


| Elemento                         | Atual       | Responsivo                            |
| -------------------------------- | ----------- | ------------------------------------- |
| Título "Entrar no Sistema"       | `text-2xl`  | `text-lg sm:text-xl md:text-2xl`      |
| Subtítulo "Sistema de Ouvidoria" | `text-sm`   | `text-xs sm:text-sm`                  |
| Labels (E-mail, Senha)           | `text-sm`   | `text-xs sm:text-sm`                  |
| "Lembrar-me"                     | `text-sm`   | `text-xs sm:text-sm`                  |
| "Esqueceu a senha?"              | `text-sm`   | `text-xs sm:text-sm`                  |
| "Não tem conta?"                 | `text-sm`   | `text-xs sm:text-sm`                  |
| Padding do container             | `p-8`       | `p-4 sm:p-6 md:p-8`                   |
| Spacing do form                  | `space-y-8` | `space-y-4 sm:space-y-6 md:space-y-8` |
| Spacing interno form             | `space-y-5` | `space-y-3 sm:space-y-5`              |


Também aplicar as mesmas classes responsivas nas páginas **Cadastro**, **RecuperarSenha** e **ResetPassword** para manter consistência.

aplicar na verdade em todo o sistema, não só nas telas de cadastros, recuperar senha reset