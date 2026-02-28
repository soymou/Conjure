# USER.md
- **Nombre:** mou
- **Cómo llamarlo:** mou
- **Zona horaria:** CST (America/Mexico_City)
- **Notas:** Matemático fan de la tecnología. Quiere configuraciones modulares en su MacBook (nix-darwin) y en el servidor que mantiene OpenClaw. Prefiere que hablemos como colegas, cuidando el uso de tokens y el orden del entorno.

## Contexto práctico
- MacBook: flake `~/.config/nix-darwin` con módulos por función (homebrew, macos, terminal, wm, dev, etc.).
- Servidor: Arch Linux con dotfiles en `~/.chezmoi`, scripts de mantenimiento y `~/.config` organizado por herramienta. También corre OpenClaw permanentemente y tiene carpetas sensibles (`~/.config/openclaw/gog.env`).
- Busca una modularidad estricta: cada ajuste vive en su módulo/fichero y se valida antes de aplicar.
