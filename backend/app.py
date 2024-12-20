from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)

# Configuration de la base de données via des variables d'environnement
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.environ['DB_USER']}:{os.environ['DB_PASSWORD']}@{os.environ['DB_HOST']}/{os.environ['DB_NAME']}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
CORS(app)  # Permet les requêtes cross-origin (nécessaire pour le frontend)

# Modèle de la transaction
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # "income" ou "expense"
    description = db.Column(db.String(100), nullable=False)

# Créer les tables dans la base de données
with app.app_context():
    db.create_all()

# Route pour récupérer toutes les transactions
@app.route('/transactions', methods=['GET'])
def get_transactions():
    transactions = Transaction.query.all()
    result = [
        {
            "id": t.id,
            "amount": t.amount,
            "type": t.type,
            "description": t.description
        }
        for t in transactions
    ]
    return jsonify(result), 200

# Route pour ajouter une transaction
@app.route('/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    new_transaction = Transaction(
        amount=data['amount'],
        type=data['type'],
        description=data['description']
    )
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({"message": "Transaction ajoutée avec succès"}), 201

# Route pour supprimer une transaction
@app.route('/transactions/<int:id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get_or_404(id)
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({"message": "Transaction supprimée avec succès"}), 200

if __name__ == '__main__':
    app.run(debug=True)
