from flask import Flask, render_template, jsonify, request
from datetime import datetime
import sqlite3

app = Flask(__name__, 
            static_folder='src',  # For serving CSS and JS files
            template_folder='.')   # For serving HTML files

def init_db():
    conn = sqlite3.connect('movies.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            year INTEGER NOT NULL,
            rating INTEGER NOT NULL,
            review TEXT NOT NULL,
            date TEXT NOT NULL,
            poster TEXT
        )
    ''')
    conn.commit()
    conn.close()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    conn = sqlite3.connect('movies.db')
    c = conn.cursor()
    c.execute('SELECT * FROM reviews ORDER BY date DESC')
    reviews = [
        {
            'id': row[0],
            'title': row[1],
            'year': row[2],
            'rating': row[3],
            'review': row[4],
            'date': row[5],
            'poster': row[6]
        }
        for row in c.fetchall()
    ]
    conn.close()
    return jsonify(reviews)

@app.route('/api/reviews', methods=['POST'])
def add_review():
    data = request.json
    conn = sqlite3.connect('movies.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO reviews (title, year, rating, review, date, poster)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        data['title'],
        data['year'],
        data['rating'],
        data['review'],
        datetime.now().isoformat(),
        data.get('poster', 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?auto=format&fit=crop&q=80&w=800')
    ))
    conn.commit()
    new_id = c.lastrowid
    conn.close()
    
    return jsonify({'id': new_id, **data})

if __name__ == '__main__':
    init_db()
    app.run(debug=True)