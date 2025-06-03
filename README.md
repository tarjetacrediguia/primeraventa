# Sistema de Gestión de Datos de Dispositivos

Este sistema proporciona una API REST para gestionar datos de dispositivos, permitiendo almacenar y recuperar información de manera eficiente utilizando un buffer FIFO.

## Características Principales

- Almacenamiento de datos de dispositivos en buffer FIFO
- Recuperación de datos por ID de dispositivo
- Sistema de autorización de dispositivos
- Manejo de información de sensores, estado de red y datos del dispositivo
- Validación de datos
- Gestión de errores robusta

## Estructura del Proyecto

```
src/
├── application/
│   ├── ports/
│   │   ├── FIFOBufferPort.ts
│   │   └── DeviceAuthorizationPort.ts
│   └── use-cases/
│       ├── GetData.ts
│       ├── SetData.ts
│       └── AuthorizeDevice.ts
├── domain/
│   └── entities/
│       ├── DeviceData.ts
│       ├── DeviceInfo.ts
│       ├── NetworkStatus.ts
│       ├── SensorData.ts
│       └── AuthorizedDevice.ts
└── infrastructure/
    ├── adapters/
    │   └── buffer/
    │       └── BufferManager.ts
    └── routes/
        └── controllers/
            └── dataController.ts
```

## API Endpoints

### 1. Verificar Estado del Servicio
```http
GET /api/v1/health
```
Respuesta:
```json
{
    "status": "OK"
}
```

### 2. Autorizar Dispositivo
```http
POST /api/v1/authorize-device
```
Cuerpo de la petición:
```json
{
    "deviceId": "DEVICE123"
}
```
Respuesta exitosa (200):
```json
{
    "message": "Dispositivo autorizado correctamente",
    "device": {
        "device_id": "DEVICE123",
        "is_active": true,
        "created_at": "2024-03-20T10:00:00Z"
    }
}
```

### 3. Almacenar Datos del Dispositivo
```http
POST /api/v1/setdata
```
Cuerpo de la petición:
```json
{
    "device_info": {
        "device_id": "DEVICE123",
        "ubicacion": "Sala Principal",
        "timestamp": "2024-03-20T10:00:00Z",
        "firmware_version": "1.0.0"
    },
    "sensor_data": {
        "analog_input": [
            {
                "pin": "A0",
                "value": 1023
            }
        ],
        "frequency": [
            {
                "pin": "D2",
                "value": 50
            }
        ],
        "digital_output": [
            {
                "pin": "D3",
                "value": true
            }
        ]
    },
    "network_status": {
        "wifi": {
            "ssid": "RedWifi",
            "signal_strength": -65
        },
        "ip_info": {
            "ip_address": "192.168.1.100",
            "mac_address": "00:11:22:33:44:55"
        }
    }
}
```
Respuesta exitosa (200):
```json
{
    "device_info": { ... },
    "sensor_data": { ... },
    "network_status": { ... }
}
```

### 4. Obtener Datos del Dispositivo
```http
GET /api/v1/getdata?deviceid=DEVICE123
```
Respuesta exitosa (200):
```json
[
    {
        "device_info": { ... },
        "sensor_data": { ... },
        "network_status": { ... }
    },
    // ... hasta 50 registros
]
```

## Códigos de Error

- 400: Error de validación (parámetros faltantes o inválidos)
- 403: Dispositivo no autorizado
- 409: Dispositivo ya autorizado
- 500: Error interno del servidor

## Ejemplos de Uso

### Autorizar Dispositivo
```bash
curl -X POST http://localhost:3000/api/v1/authorize-device \
  -H "Content-Type: application/json" \
  -d '{
    "deviceId": "DEVICE123"
  }'
```

### Almacenar Datos
```bash
curl -X POST http://localhost:3000/api/v1/setdata \
  -H "Content-Type: application/json" \
  -d '{
    "device_info": {
      "device_id": "DEVICE123",
      "ubicacion": "Sala Principal",
      "timestamp": "2024-03-20T10:00:00Z",
      "firmware_version": "1.0.0"
    },
    "sensor_data": {
      "analog_input": [
        {
          "pin": "A0",
          "value": 1023
        }
      ]
    },
    "network_status": {
      "wifi": {
        "ssid": "RedWifi",
        "signal_strength": -65
      }
    }
  }'
```

### Obtener Datos
```bash
curl "http://localhost:3000/api/v1/getdata?deviceid=DEVICE123"
```

## Notas Importantes

1. El sistema mantiene un máximo de 50 registros por dispositivo
2. Los datos se almacenan en un buffer FIFO (First In, First Out)
3. La validación de datos se realiza automáticamente al recibir la información
4. Los timestamps deben estar en formato ISO 8601
5. Los valores de los sensores deben ser numéricos o booleanos según el tipo
6. Es necesario autorizar el dispositivo antes de poder enviar datos
7. Un dispositivo solo puede ser autorizado una vez

## Manejo de Errores

El sistema proporciona mensajes de error detallados en español:

- Para datos faltantes o inválidos
- Para dispositivos no autorizados
- Para dispositivos ya autorizados
- Para errores de conexión
- Para problemas de validación de datos
- Para errores internos del servidor

## Seguridad

- Se recomienda implementar autenticación y autorización
- Validar y sanitizar todos los datos de entrada
- Implementar rate limiting para prevenir abusos
- Usar HTTPS en producción
- Mantener un registro de dispositivos autorizados
