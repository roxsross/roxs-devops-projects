'''
Tests para el endpoint Consulta
'''
from server import create_app
from utils.tests_utils import log_testUser


def test_consulta_get_no_token():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        response = test_client.get('/consulta?string=test')
        assert response.status_code == 403
        assert b"token is missing" in response.data


def test_consulta_get_token():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        test_client.post('/almacena?string=test', headers={'X-Service-Token': data['token']})
        response = test_client.get('/consulta?string=test', headers={'X-Service-Token': data['token']})
        assert response.status_code == 200
        assert b"en las que aparece" in response.data


def test_consulta_get_token_bad_request_no_string_parameter():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.get('/consulta?bad=test', headers={'X-Service-Token': data['token']})
        assert response.status_code == 400
        assert b"No se ha encontrado" in response.data

'''
    # Create a test client using the Flask application configured for testing
    with app.test_client() as test_client:
        response = test_client.get('/consulta?bad=test')
        assert b"token is missing" in response.data
    return 0
'''

def test_consulta_bad_request_2_words():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.get('/consulta?string=test espacio', headers={'X-Service-Token': data['token']})
        assert response.status_code == 400
        assert b"debe ser una" in response.data

def test_consulta_bad_request_wrong_method():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.post('/consulta?string=test', headers={'X-Service-Token': data['token']})
        assert response.status_code == 400
        assert b"Use GET" in response.data


