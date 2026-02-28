# REFERENCE.md

## Contexto de código
- La MacBook usa `~/.config/nix-darwin` con un `flake.nix` que importa módulos (`modules/homebrew`, `modules/macos`, `modules/terminal/*`, `modules/dev/*`, `modules/wm/*`, `modules/openclaw`, `modules/server`). Cada módulo define servicios, paquetes, alias y scripts específicos.
- El servidor Arch tiene dotfiles bajo `~/.chezmoi` (con `Brewfile`, scripts como `run_onchange_macos-defaults.sh`, `dot_config/fish`, `ghostty`, etc.), `~/.config` con herramientas y `.openclaw` ejecutando agentes, además de `n8n/` para automatización y `~/.config/openclaw/gog.env` con credenciales sensibles.
- Tu código debe mantener modularidad: funciones pequeñas, nombres semánticos, reutilización de módulos y separación XML/JSON/scripts y lógica de configuración.

## Estándar visual y de presentación
- Respuestas en formato de tarjetas verticales con título claro, descripción concisa y pasos numerados.
- Espacio negativo controlado y uso de acentos en títulos o estadísticas para resaltar la intención.
- Snippets o bloques de código aparecen en monoespaciado, rodeados de espacio para que no saturen.
- Resalta métricas o decisiones clave con verbos en negrita y alineación clara (lo más similar a un panel minimalista y ordenado).
