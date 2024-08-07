'''

'''

from flask import request, jsonify, make_response, current_app
from flask import Blueprint
from werkzeug.exceptions import HTTPException
from functools import wraps
import jwt


# Hacemos uso de la biblioteca unicodedata para tratar las tildes y caracteres epeciales
import unicodedata

# Librerias propias
import config.default
from server import db
from models.entitys import User, Cadena, InvalidToken
from utils.stopwatch import Stopwatch
from utils.status import Status, registrar_usage


private_bp = Blueprint('private', __name__, template_folder='templates')


def token_required(f):
    @wraps(f)
    def decorator(*args, **kwargs):
        current_app.logger.info('Comprobando Token')
        token = None

        if 'X-Service-Token' in request.headers:
            token = request.headers['X-Service-Token']

        if not token:
            return make_response(jsonify({'message': 'A valid token is missing'}), 403)

        # Comprobamos que el token no haya sido marcado como inválido
        results = InvalidToken.query.filter_by(token_body=token).all()
        if len(results) > 0:
            return make_response(jsonify({'message': 'token expired'}), 403)

        try:
            data = jwt.decode(token, config.default.SECRET_KEY, algorithms="HS256")
            current_user = User.query.filter_by(public_id=data['public_id']).first()
        except:
            return make_response(jsonify({'message': 'token is invalid'}), 403)

        return f(current_user, *args, **kwargs)
    return decorator

# El endpoint "almacena"
'''
El endpoint recibe la cadena como parámetro y la guarda en una nueva línea en la Base de Datos
El nombre del parámetro es 'string'
la petición tiene el formato /almacena?string
Devuelve:
    * una respuesta HTML 200 OK con un json en el cuerpo indicando que el mensaje se ha creado correctamente
    * una respuesta HTML 400 BAD REQUEST con un json en el cuerpo si la petición no es correcta
'''


@private_bp.route("/almacena", methods=['POST', 'GET'])
@token_required
def almacenar(current_user):
    stopwatch = Stopwatch()
    endpoint_name = "ALMACENA"
    current_app.logger.debug('Acceso a Almacena')
    if request.method == 'POST':
        if 'string' in request.args:
            cadena = request.args.get('string')

            try:
                # Para el caso de uso
                new_cadena = Cadena(text=cadena,
                                    public_id_fk=current_user.public_id)
                db.session.add(new_cadena)
                db.session.commit()
                data = {'code': 'SUCCESS', 'message': cadena + ' ADDED', 'userid': current_user.public_id}
                current_app.logger.info(endpoint_name + "|" + data['message'] + "|" + data['userid'])

                # Para el registro de uso
                registrar_usage(endpoint_name, Status.SUCCES.value, stopwatch)

                return make_response(jsonify(data), 201)

            except BaseException as err:
                data = {'code': 'DB ERROR', 'message': err.args[0],
                        'userid': current_user.public_id, 'cadena': cadena}
                current_app.logger.error(endpoint_name + "|" + data['message'])
                # Para el registro de uso
                registrar_usage(endpoint_name, Status.FAIL.value, stopwatch)

                return make_response(jsonify(data), 500)
        else:
            data = {'code': 'BAD REQUEST', 'message': 'No se ha encontrado el parámetro "string"'}
            current_app.logger.warning(endpoint_name + "|" + data['message'])
            return make_response(jsonify(data), 400)
    else:
        data = {'code': 'BAD REQUEST', 'message': 'Petición no válida: Use POST'}
        current_app.logger.warning(endpoint_name + "|" + data['message'])
        return make_response(jsonify(data), 400)

# El endpoint "consulta"
'''
El endpoint recibe la cadena como parámetro y comprueba el número de veces que aparece dentro de la Base de Datos
El nombre del parámetro es 'string'
Devuelve: 
    * una respuesta HTML 200 OK con un json en el cuerpo indicando el número de veces que se ha encontrado la palabra
    * una respuesta HTML 400 BAD REQUEST con un json en el cuerpo si la petición no es correctauna respuesta
'''


@private_bp.route("/consulta", methods=['GET', 'POST'])
@token_required
def consultar(current_user):
    stopwatch = Stopwatch()
    endpoint_name = "CONSULTA"
    current_app.logger.debug('Acceso a Consulta')
    if request.method == 'GET':
        if 'string' in request.args:
            cadena = request.args.get('string')
            if " " not in cadena:
                try:
                    # Para el caso de uso
                    results = Cadena.query.all()
                    contador = 0
                    for result in results:
                        '''
                        Usamos unicodedata.normalize() para eliminar las tildes
                        con la opcion NFKD para que lo descomponga en caracteres simples + símbolos aditivos
                        lo codificamos a ASCII teniendo en cuenta sólo los caracteres simples (encode('ASCII','ignore'),
                        y lo convertimos de nuevo en cadena (decode('ASCII'))
                        Por último, usamos el método casefold() para ignorar mayúsculas
                        '''
                        cadena_aux = unicodedata.normalize('NFKD', cadena).encode('ASCII', 'ignore').decode(
                            'ASCII').casefold()
                        result_aux = unicodedata.normalize('NFKD', result.text).encode('ASCII', 'ignore').decode(
                            'ASCII').casefold()
                        if cadena_aux in result_aux:
                            contador = contador + 1

                    data = {'code': 'SUCCESS', 'message': 'Líneas en las que aparece: ' + str(contador), 'userid': current_user.public_id}
                    current_app.logger.info(endpoint_name + "|" + data['message'] + "|" + data['userid'])

                    # Para el registro de uso
                    registrar_usage(endpoint_name, Status.SUCCES.value, stopwatch)

                    return make_response(jsonify(data), 200)

                except BaseException as err:
                    data = {'code': 'DB ERROR', 'message': err.args[0],
                            'userid': current_user.public_id, 'cadena': cadena}
                    current_app.logger.error(endpoint_name + "|" + data['message'])
                    # Para el registro de uso
                    registrar_usage(endpoint_name, Status.FAIL.value, stopwatch)
                    return make_response(jsonify(data), 500)
            else:
                data = {'code': 'BAD REQUEST', 'message': 'El parámetro debe ser una única palabra'}
                current_app.logger.warning(endpoint_name + "|" + data['message'])
                return make_response(jsonify(data), 400)
        else:
            data = {'code': 'BAD REQUEST', 'message': 'No se ha encontrado el parámetro string'}
            current_app.logger.warning(endpoint_name + "|" + data['message'])
            return make_response(jsonify(data), 400)
    else:
        data = {'code': 'BAD REQUEST', 'message': 'Petición no válida: Use GET'}
        current_app.logger.warning(endpoint_name + "|" + data['message'])
        return make_response(jsonify(data), 400)


@private_bp.route("/logout", methods=['GET'])
@token_required
def logout(current_user):
    stopwatch = Stopwatch()
    endpoint_name = "LOGOUT"
    current_app.logger.debug('Acceso a Logout')
    token = request.headers['X-Service-Token']
    try:
        new_invalidToken = InvalidToken(token_body=token, public_id_fk=current_user.public_id)
        db.session.add(new_invalidToken)
        db.session.commit()
        data = {'code': 'SUCCESS', 'message': 'Logout realizado con éxito',
                'userid': current_user.public_id, 'tokenInvalidado': token}
        current_app.logger.info(endpoint_name + "|" + data['message']+"|"+data['userid'])
        # Para el registro de uso
        registrar_usage(endpoint_name, Status.SUCCES.value, stopwatch)
        return make_response(jsonify(data), 200)
    except BaseException as err:
        data = {'code': 'ERROR', 'message': err.args[0],
                'userid': current_user.public_id, 'token': token}
        current_app.logger.error(endpoint_name + "|" + data['message'])
        # Para el registro de uso
        registrar_usage(endpoint_name, Status.FAIL.value, stopwatch)
        return make_response(jsonify(data), 500)


@private_bp.errorhandler(Exception)
def handle_exception(e):
    # pass through HTTP errors
    if isinstance(e, HTTPException):
        data = {'code': 'ERROR', 'message': 'Servicio no Disponible'}
        return make_response(jsonify(data), 503)

    # now you're handling non-HTTP exceptions only
    data = {'code': 'ERROR', 'message': 'Generic Error'}
    return make_response(jsonify(data), 500)