# Servicio Web de Agenda (Express)

## Instalación y ejecución
```
npm install
npm start
```
Requiere Node.js 18 o superior (usa `fetch` nativo).

## Endpoints

### Listar contactos
`GET http://localhost:3000/contactos`

### Almacenar contacto
`POST http://localhost:3000/contactos`
Header: `Content-Type: application/json`
```json
{
  "nombre": "Pedro",
  "apellido": "Lopez",
  "telefono": "8095551234"
}
```

Ejemplo con curl:
```
curl -X POST http://localhost:3000/contactos \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Pedro","apellido":"Lopez","telefono":"8095551234"}'
```
