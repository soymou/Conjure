# REFERENCE.md

## MacBook (nix-darwin)
- Flake en `~/.config/nix-darwin/flake.nix` con inputs para `nixpkgs-25.11-darwin`, `nix-darwin`, `home-manager`, `agenix`, `paperwm` y un `darwinConfiguration "mou-mac"` que importa módulos.
- Los módulos viven en `modules/` y atienden áreas: `homebrew`, `macos`, `terminal/` (`fish`, `ghostty`, `starship`, `zsh`), `dev/` (`git`, `editors`, `ssh`, `nvim`, `doom`), `openclaw`, `server`, `wm/` (Paneru, SketchyBar, etc.).
- Homebrew habilita taps (emacs-plus, anomalyco, koekeishiya) y fórmulas/casks para OpenClaw, herramientas GNU, apps de comunicación y utilidades.
- macOS ajusta Dock, Finder, Trackpad, captura de pantalla y tiene un script `postActivation` para defaults extra y directorios como `~/Pictures/Screenshots`.
- Terminal/zsh define alias (`update`, `server`, `desktop`, `chat`) y contenido de `initContent` (Starship, fastfetch). Hay alias y scripts de activación mientras `home-manager` usa paquetes como `ripgrep`, `fd`, `bat`, `zoxide`, `aspell` con dictados español/inglés.
- El módulo `openclaw` solo asegura que `~/.openclaw` y `workspace` existan; la configuración de `openclaw.json` queda fuera de Nix por ahora.
- `nix.darwin/modules/server/default.nix` está vacío (puede usarse después para paquetes comunes al servidor). Módulos de ventana (por ejemplo `wm/paneru`, `sketchybar`, `yabai`, etc.) están listos para extender.

## Servidor (Arch Linux)
- Kernel 6.18.9-arch1-2, usuario `mou` con dotfiles en `~/.chezmoi`. Ahí hay `Brewfile`, scripts (`run_onchange_macos-defaults.sh`, `run_once_setup-dev-tools.sh`), y directorio `dot_config/` con subcarpetas por herramienta (`fish`, `ghostty`, `starship`, `git`, `ssh`).
- `Brewfile` refleja un espejo de herramientas (ollama, bun, zeroclaw, nodejs, opencode, etc.) aún cuando corre en Linux; sirve como inspiración para mantener consistencia entre máquinas.
- `~/.config/` alberga `clawhub`, `fish`, `openclaw`, `opencode`, `systemd`, `yay`, `nvim`, `newsboat`, `sketchybar`, `gcloud`, etc. También hay `n8n/` con Docker Compose y `.openclaw/` con agentes/identidad, lo que significa que este servidor hospeda tu OpenClaw de forma permanente.
- `~/.config/openclaw/gog.env` guarda `GOG_KEYRING_PASSWORD=aleph`, así que evita exponer contraseñas en el código de los módulos.
- No hay `nix` en el PATH actual, por lo que los ajustes relacionados con Nix en el servidor deberían seguir usando scripts o `chezmoi`.

Mantén esta referencia actualizada cada vez que un módulo nuevo nacen o un script cambia significativamente. Si detectas redundancias o módulos huérfanos (por ejemplo, un `dev/editors` repetido), propones limpiezas pequeñas en lugar de borrados masivos.
