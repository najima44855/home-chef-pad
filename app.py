from flask import Flask, render_template
app = Flask(__name__)

# add post routes

@app.route('/')
def main():
    return render_template('index.html', pageTitle='Home')

@app.route('/recipes')
def getRecipes():
    return render_template('recipes.html', pageTitle='Recipes')

if __name__ == '__main__':
    app.run(debug=True)