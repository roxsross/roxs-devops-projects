'''
Tests para el endpoint Health
'''
from server import create_app


def test_ready_ok():
    # Create a test client using the Flask application configured for testing
    with create_app().test_client() as test_client:
        response = test_client.get('/ready')
        assert response.status_code == 200
    return 0

'''
def test_ready_not_ok():
    # Create a test client using the Flask application configured for testing
    with app.test_client() as test_client:
        response = test_client.get('/ready')
        assert response.status_code == 503
    return 0
'''