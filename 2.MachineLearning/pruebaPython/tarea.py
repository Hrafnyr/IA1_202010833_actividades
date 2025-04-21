import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.metrics import classification_report, accuracy_score

# Cargar los datos
df = pd.read_csv('data.csv')

# Opcional: verificar datos
print(df.head())

# Variables independientes y dependiente
X = df[['ADUANA']]
y = df['VIA']

# Separar datos en entrenamiento y prueba
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Crear modelo polinómico de grado 2
grado = 4
modelo_poli = make_pipeline(PolynomialFeatures(grado), LinearRegression())
modelo_poli.fit(X, y)

# Crear datos para la curva suave
X_plot = np.linspace(X.min(), X.max(), 500).reshape(-1, 1)
y_plot = modelo_poli.predict(X_plot)

# Graficar
plt.figure(figsize=(10, 6))
plt.scatter(X, y, color='blue', label='Datos reales')
plt.plot(X_plot, y_plot, color='red', linewidth=2, label=f'Regresión polinomial (grado {grado})')
plt.xlabel('ADUANA')
plt.ylabel('VIA')
plt.title('Regresión Polinomial')
plt.legend()
plt.grid(True)
plt.savefig('regresion_polinomial_grado5.png', dpi=300)
#plt.show()

# Evaluación
print("Score (R²) polinomial:", modelo_poli.score(X_test, y_test))

#--------------- Árbol de decisión
# Selección de atributos
X = df[['VALOR', 'PAIS', 'ADUANA']]  # Atributos escogidos a prueba y error
y = df['VIA']  # la variable a predecir

# División de datos (80% entrenamiento, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

clf = DecisionTreeClassifier(random_state=42)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

print("Accuracy:", accuracy_score(y_test, y_pred))
print("\nReporte de clasificación:\n", classification_report(y_test, y_pred))

plt.figure(figsize=(16, 8))
plot_tree(clf, feature_names=X.columns, class_names=['1', '2', '3'], filled=True)
plt.title("Árbol de decisión para predecir VIA")
plt.savefig("arbol_decision_via.png", dpi=300)
plt.show()




