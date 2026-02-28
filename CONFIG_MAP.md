# Configuración actual

## MacBook Air (mou-mac)
- Base declarativa en `~/.config/nix-darwin`, con `flake.nix` que combina inputs de `nixpkgs-25.11-darwin`, `nix-darwin`, `home-manager` y dependencias opcionales (`agenix`, `paperwm`).
- El output principal es `darwinConfigurations."mou-mac"`, que:
  - usa `home-manager` y módulos personalizados para mantener la configuración modular.
  - habilita `programs.fish` y `services.openssh`, define al usuario `mou` (shell Zsh) y `system.stateVersion = 6`.
  - incluye una sección de `home-manager` para `mou` con módulos `openclaw`, `terminal/zsh`, `terminal/ghostty`, `terminal/starship`, `dev/git`, `dev/editors`, `dev/ssh` y otro `dev/editors` redundante que merece limpieza.
  - agrega paquetes como `ripgrep`, `fd`, `bat`, `eza`, `zoxide`, `neofetch`, `cmake`, `libtool`, `wakeonlan` y `aspell` con diccionarios en español e inglés.
- Módulos clave dentro de `modules/`:
  - `homebrew`: habilita Homebrew y actualizaciones automáticas, define taps (`d12frosted/emacs-plus`, `anomalyco/tap`, `koekeishiya/formulae`) y una larga lista de fórmulas/casks (OpenClaw, tooling GNU, apps como Ghostty, Raycast, ProtonVPN, etc.).
  - `macos`: ajustes de Dock, Finder, Trackpad y preferencias globales (lectura de archivos ocultos, paneles expandidos, captura de pantalla en `~/Pictures/Screenshots`, scripts post-activación para defaults extra). También habilita TouchID para sudo.
  - `terminal/zsh`: activa completados/autosuggestions/syntax highlighting y define alias (`update`, `server`, `desktop`, `chat`) además de `initContent` con `starship` y `fastfetch`.
  - `terminal/starship`, `ghostty`, `fish`: (aún no inspeccionados, pero alineados con la terminal modular).
  - `openclaw`: garantiza presencia de `~/.openclaw` y workspace, dejando la gestión del `openclaw.json` opcional.
  - `wm/` y `wm/paneru`, `wm/sketchybar`, etc.: agrupaciones para la capa de ventana/titulares (PaperWM, Paneru, SketchyBar, etc.) que podemos seguir expandiendo en bloque modular.
  - `dev/` (editors, git, nvim, ssh): se espera que definan configuraciones específicas para editores y SSH, manteniendo la modularidad.
- Plantillas y scripts se organizan en `templates/`; el flake permite generar nuevos módulos o instancias.

## Servidor (`mou-server`)
- Linux Arch x86_64 con kernel `6.18.9-arch1-2`.
- Dotfiles y scripts en `~/.chezmoi`:
  - `Brewfile` (aunque orientado a macOS) con taps y paquetes similares a los del Mac (ollama, bun, zeroclaw, nodejs, opencode, etc.) y casks para apps de escritorio que iluminan las intenciones cruzadas.
  - Scripts `run_onchange_macos-defaults.sh` / `run_once_setup-dev-tools.sh` coordinan ajustes del sistema y herramientas, lo cual ya da pistas del repertorio modular de mantenimiento.
  - Carpeta `dot_config/` que aloja subcarpetas como `fish/`, `ghostty/`, `starship/`, `git/` y `ssh/`, lo que mantiene la modularidad de cada capa de la shell.
  - `dot_ssh/` con la integración de 1Password y GitHub.
- `~/.config/` contiene bloques relevantes: `clawhub`, `fish`, `gcloud`, `nvim`, `openclaw`, `opencode`, `systemd`, `yay`, `newsboat`, etc., que reflejan los subsistemas que el agente debe conocer.
- `n8n/` guarda la configuración Docker/compose para la automatización local.
- `.openclaw/` en la home alberga identidad, agentes y workspaces, confirmando que este servidor sigue ejecutando OpenClaw de forma permanente.
- `~/.config/openclaw/gog.env` define credenciales de `GOG_KEYRING_PASSWORD`, lo que indica que el agente debe proteger variables sensibles.

Este mapa es la base para el agente modular de configuración: conoce dónde buscar en cada máquina y cuáles son los componentes clave (dotfiles, scripts, módulos declarativos) para mantener la modularidad y poder ampliar la configuración sin indiscriminación.