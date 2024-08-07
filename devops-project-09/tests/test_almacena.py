'''
Tests para el endpoint Almacena
'''
from server import create_app
from utils.tests_utils import log_testUser

def test_almacena_post_no_token():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        response = test_client.post('/almacena?string=main')
        assert response.status_code == 403
        assert b"token is missing" in response.data


def test_almacena_post_token():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.post('/almacena?string=main', headers={'X-Service-Token': data['token']})
        assert response.status_code == 201
        assert b"main ADDED" in response.data


def test_almacena_post_token_bad_request_no_string_parameter():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.post('/almacena?bad=main', headers={'X-Service-Token': data['token']})
        assert response.status_code == 400
        assert b"BAD REQUEST" in response.data



def test_almacena_bad_request_wrong_method():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        data, token_status_code = log_testUser()
        response = test_client.get('/almacena?string=main', headers={'X-Service-Token': data['token']})
        assert response.status_code == 400
        assert b"Use POST" in response.data

