'''

'''

from server import db


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.Integer, unique=True)
    name = db.Column(db.String(50))
    password = db.Column(db.String(50))
    cadenas_ingresadas = db.relationship('Cadena', back_populates='ingresada_por')
    tokens_expirados = db.relationship('InvalidToken', back_populates='pertenece_a')


class Cadena(db.Model):
    __tablename__ = 'cadenas'
    id = db.Column(db.Integer, primary_key=True)
    text = db.Column(db.String(100))
    public_id_fk = db.Column(db.ForeignKey('users.public_id'))
    ingresada_por = db.relationship('User', back_populates='cadenas_ingresadas')


class InvalidToken(db.Model):
    __tablename__='invalidtokens'
    id = db.Column(db.Integer, primary_key=True)
    token_body = db.Column(db.String(100))
    public_id_fk = db.Column(db.ForeignKey('users.public_id'))
    pertenece_a = db.relationship('User', back_populates='tokens_expirados')

class EndpointUsage(db.Model):
    __tablename__='endpointusage'
    id = db.Column(db.Integer, primary_key=True)
    endpoint_name = db.Column(db.String(50))
    status = db.Column(db.String(50))
    response_time = db.Column(db.Float)
    fecha_acc = db.Column(db.DateTime())

