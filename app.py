from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Database setup
def init_db():
    with sqlite3.connect("database.db") as conn:
        cur = conn.cursor()
        cur.execute("""
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            movie_title TEXT NOT NULL,
            review TEXT NOT NULL,
            rating INTEGER NOT NULL
        )
        """)
        conn.commit()

init_db()

@app.route("/")
def home():
    with sqlite3.connect("database.db") as conn:
        cur = conn.cursor()
        cur.execute("DELETE FROM reviews")  # Clears all stored reviews
        conn.commit()
    return render_template("index.html")

@app.route("/submit_review", methods=["POST"])
def submit_review():
    data = request.json
    movie_title = data["title"]
    review = data["review"]
    rating = data["rating"]

    with sqlite3.connect("database.db") as conn:
        cur = conn.cursor()
        cur.execute("INSERT INTO reviews (movie_title, review, rating) VALUES (?, ?, ?)", 
                    (movie_title, review, rating))
        conn.commit()

    return jsonify({"message": "Review submitted successfully!"})

@app.route("/get_reviews/<movie_title>", methods=["GET"])
def get_reviews(movie_title):
    with sqlite3.connect("database.db") as conn:
        cur = conn.cursor()
        cur.execute("SELECT review, rating FROM reviews WHERE movie_title = ?", (movie_title,))
        reviews = cur.fetchall()

    return jsonify(reviews)



if __name__ == "__main__":
    app.run(debug=True)
