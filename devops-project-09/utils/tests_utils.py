
import base64
import json
from server import create_app

def log_testUser():
    with create_app().test_client() as test_client:
        '''
        Si se utiliza el esquema de la autenticación "Basic", las credenciales son construidas de esta forma:
            - El usuario y la contraseña se combinan con dos puntos (aladdin:opensesame).
            - El string resultante está basado en la codificación base64 (YWxhZGRpbjpvcGVuc2VzYW1l).
        '''
        credentials = base64.b64encode(b"testUser:testPass").decode('utf-8')
        response = test_client.get('/login', headers={"Authorization": f"Basic {credentials}"})
        rawdata = response.data.decode('utf-8')
        data = json.loads(rawdata)
        return data, response.status_code

