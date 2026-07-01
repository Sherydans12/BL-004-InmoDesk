# 13 — Reglas de trabajo para agentes

## Estado del proyecto

El proyecto está en etapa de definición inicial. No comenzar a programar sin antes revisar toda la documentación del repositorio.

## Reglas obligatorias

1. No cambiar el nombre interno BL-004.
2. No asumir que Altavista Propiedades forma parte del mismo repo.
3. No convertir el sitio público demo en el producto principal.
4. No agregar funcionalidades fuera del MVP v0 sin aprobación.
5. No decidir stack técnico definitivo sin confirmación.
6. No cambiar nombres de módulos ni conceptos base sin justificarlo.
7. Priorizar claridad comercial sobre complejidad técnica en la demo.
8. Mantener separación entre datos públicos e internos.
9. Mantener el panel admin como núcleo reutilizable del producto.
10. Documentar decisiones nuevas en `project-decisions.json` o documento correspondiente.

## Orden de trabajo sugerido

1. Leer README.
2. Leer docs/00 a docs/13.
3. Leer prompts/01-agent-start-context.md.
4. Proponer plan técnico.
5. Esperar aprobación antes de programar.

## Criterio de calidad

Toda implementación debe ayudar a mostrar el flujo:

**propiedad → publicación → lead → seguimiento → visita → pipeline**.

Si una tarea no ayuda a ese flujo, probablemente no pertenece al MVP v0.
