from enum import Enum
from server import db
from models.entitys import EndpointUsage

class Status(Enum):
    SUCCES = 'SUCCESS'
    FAIL = 'FAIL'


def registrar_usage(endpoint_name, status, stopwatch):
    stopwatch.stop_stopwatch()
    new_usage = EndpointUsage(endpoint_name=endpoint_name,
                              status=status,
                              response_time=stopwatch.elapsed_time,
                              fecha_acc=stopwatch.creation_time)
    db.session.add(new_usage)
    db.session.commit()



