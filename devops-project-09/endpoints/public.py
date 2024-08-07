'''

'''

from flask import request, jsonify, make_response, current_app
from flask import Blueprint
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.exceptions import HTTPException
import jwt
import uuid
import datetime
from sqlalchemy.sql import func

import config.default
from server import db
from server import get_hit_count
from models.entitys import User, Cadena, EndpointUsage

public_bp = Blueprint('public', __name__, template_folder='templates')


# Con @public_bp.route() marcamos el comportamiento que llevará a cabo nuestra aplicación
# Endpoint Home Page
@public_bp.route("/")
def home():
    count = get_hit_count()
    current_app.logger.info('Acceso a Home')
    return "<h1>Servicio Web by @roxsross</h1><br><p>Has visitado la página {} veces".format(count)


@public_bp.route('/login', methods=['GET', 'POST'])
def login_user():
    current_app.logger.info('Acceso a Login')
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return make_response('could not verify', 401, {'WWW.Authentication': 'Basic realm: "login required"'})

    user = User.query.filter_by(name=auth.username).first()

    if check_password_hash(user.password, auth.password):
        token = jwt.encode({'public_id': user.public_id, 'exp': datetime.datetime.now() + datetime.timedelta(minutes=60)}, config.default.SECRET_KEY, algorithm="HS256")
        #return jsonify({'token': token.decode('UTF-8')})
        return jsonify({'token': token})
    return make_response('could not verify',  401, {'WWW.Authentication': 'Basic realm: "login required"'})


@public_bp.route('/signup', methods=['GET', 'POST'])
def signup_user():
    current_app.logger.info('Acceso a SignUp')
    data = request.get_json()

    hashed_password = generate_password_hash(data['password'], method='sha256')

    new_user = User(public_id=str(uuid.uuid4()), name=data['name'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'registered successfully'})



@public_bp.route('/users', methods=['GET'])
def get_all_users():
    current_app.logger.info('Acceso a ListUsers')
    users = User.query.all()

    result = []

    for user in users:
        user_data = {}
        user_data['public_id'] = user.public_id
        user_data['name'] = user.name
        user_data['password'] = user.password

        result.append(user_data)

    return jsonify({'users': result})


@public_bp.route('/ready')
def ready_check():
    current_app.logger.info('Acceso a ReadyCheck')
    if database_works() and loggin_works():
        data = {'code': 'SUCCESS', 'message': 'ALL OK'}
        return make_response(jsonify(data), 200)
    else:
        data = {'code': 'ERROR', 'message': 'SERVICE IS NOT RUNNING CORRECTLY'}
        return make_response(jsonify(data), 503)


def database_works():
    try:
        users = User.query.all()
        return True
    except:
        return False

def loggin_works():
    try:
        current_app.logger.info('Checking if loggin works as expected')
        return True
    except:
        return False

@public_bp.route('/health')
def health_check():
    current_app.logger.info('Acceso a HealthCheck')
    data = {'code': 'SUCCESS', 'message': 'ALL OK'}
    return make_response(jsonify(data), 200)


@public_bp.route('/metrics')
def metrics_show():
    current_app.logger.info('Acceso a Metrics')

    # Endpoint CONSULTA
    consultaHits = EndpointUsage.query.filter(EndpointUsage.endpoint_name == 'CONSULTA').count()
    resultsAvgResConsulta = EndpointUsage.query.with_entities(func.avg(EndpointUsage.response_time).filter(EndpointUsage.endpoint_name=='CONSULTA')).first()
    for row in resultsAvgResConsulta:
        averageConsulta = row

    # Endpoint ALMACENA
    almacenaHits = EndpointUsage.query.filter(EndpointUsage.endpoint_name == 'ALMACENA').count()
    resultsAvgResAlmacena = EndpointUsage.query.with_entities(func.avg(EndpointUsage.response_time).filter(EndpointUsage.endpoint_name=='ALMACENA')).first()
    for row in resultsAvgResAlmacena:
        averageAlmacena = row

    # DB entries
    resultsEntries = Cadena.query.count()

    data = {
        "metrics": [{
            "Endpoint_CONSULTA": [{
                "name": "consulta_avg_response_time",
                "value": averageConsulta
            },
                {
                    "name": "consulta_hits",
                    "value": consultaHits
                }
            ]
        },
            {
                "Endpoint_ALMACENA": [{
                    "name": "almacena_avg_response_time",
                    "value": averageAlmacena
                },
                    {
                        "name": "almacena_hits",
                        "value": almacenaHits
                    }
                ]
            },
            {
                "Resource_DB": [{
                    "name": "db_entries",
                    "value": resultsEntries
                }]
            }
        ]
    }
    return make_response(jsonify(data), 200)


@public_bp.errorhandler(Exception)
def handle_exception(e):
    # pass through HTTP errors
    if isinstance(e, HTTPException):
        data = {'code': 'ERROR', 'message': 'Servicio no Disponible'}
        return make_response(jsonify(data), 503)

    # now you're handling non-HTTP exceptions only
    data = {'code': 'ERROR', 'message': 'Generic Error'}
    return make_response(jsonify(data), 500)

