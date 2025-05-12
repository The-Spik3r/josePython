"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Code, FileCode, AlertTriangle, Trophy } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Datos de ejemplo para el quiz de código Python
const quizData = [
  {
    question: `def misterio(lista):
    if len(lista) <= 1:
        return lista
    pivot = lista[0]
    izquierda = [x for x in lista[1:] if x < pivot]
    derecha = [x for x in lista[1:] if x >= pivot]
    return misterio(izquierda) + [pivot] + misterio(derecha)`,
    options: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort", "Selection Sort"],
    correctAnswer: "Quick Sort",
    explanation:
      "Este código implementa el algoritmo Quick Sort recursivo. Utiliza un elemento pivote (el primer elemento) y divide la lista en dos sublistas: elementos menores que el pivote y elementos mayores o iguales que el pivote.",
    filename: "sorting.py",
  },
  {
    question: `def funcion(n):
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        return funcion(n-1) + funcion(n-2)`,
    options: ["Factorial", "Secuencia de Fibonacci", "Suma de números", "Potencia de 2", "Secuencia aritmética"],
    correctAnswer: "Secuencia de Fibonacci",
    explanation:
      "Este código calcula el n-ésimo número de la secuencia de Fibonacci usando recursión. La secuencia se define como F(n) = F(n-1) + F(n-2) con casos base F(0) = 0 y F(1) = 1.",
    filename: "recursion.py",
  },
  {
    question: `x = [1, 2, 3]
y = x
y.append(4)
print(x)`,
    options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[4, 1, 2, 3]", "Error", "None"],
    correctAnswer: "[1, 2, 3, 4]",
    explanation:
      "En Python, las variables de lista son referencias. Cuando asignamos 'y = x', ambas variables apuntan a la misma lista en memoria. Por lo tanto, cualquier modificación a través de 'y' también afecta a 'x'.",
    filename: "references.py",
  },
  {
    question: `def calcular(a, b=2, *args, **kwargs):
    # Función que suma todos los argumentos
    resultado = a + b
    for arg in args:
        resultado += arg
    for key in kwargs:
        resultado += kwargs[key]
    return resultado
    
print(calcular(1, 3, 5, 7, x=9, y=11))`,
    options: ["1", "4", "16", "36", "Error"],
    correctAnswer: "36",
    explanation:
      "La función suma todos sus argumentos. a=1, b=3 (sobrescribe el valor por defecto), args=(5, 7), kwargs={'x': 9, 'y': 11}. Por lo tanto: 1 + 3 + 5 + 7 + 9 + 11 = 36.",
    filename: "function_params.py",
  },
]

// Componente para mostrar código como en un IDE
const CodeIDE = ({ code, filename }: { code: string; filename: string }) => {
  const lines = code.split("\n")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg overflow-hidden border border-slate-700 mb-8"
    >
      {/* Barra superior del IDE */}
      <div className="bg-slate-800 text-slate-300 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <FileCode className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{filename}</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500"></div>
          <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
          <div className="h-3 w-3 rounded-full bg-green-500"></div>
        </div>
      </div>

      {/* Área de explorador de archivos simulada */}
      <div className="flex">
        <div className="bg-slate-900 w-12 border-r border-slate-700 flex-shrink-0">
          <div className="py-2 px-3 text-slate-500 text-xs">
            <Code className="h-4 w-4" />
          </div>
        </div>

        {/* Área de código con números de línea */}
        <div className="flex flex-1 bg-slate-950">
          {/* Números de línea */}
          <div className="py-3 px-2 text-right bg-slate-900 text-slate-500 select-none border-r border-slate-700">
            {lines.map((_, i) => (
              <div key={i} className="text-xs leading-6">
                {i + 1}
              </div>
            ))}
          </div>

          {/* Código con resaltado de sintaxis */}
          <div className="py-3 px-4 overflow-x-auto font-mono text-sm whitespace-pre text-slate-300 w-full">
            {lines.map((line, i) => (
              <div key={i} className="leading-6">
                {highlightPythonSyntax(line)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barra de estado inferior */}
      <div className="bg-slate-800 text-slate-400 px-4 py-1 text-xs flex justify-between">
        <div>Python 3.10.0</div>
        <div>UTF-8</div>
        <div>Spaces: 4</div>
      </div>
    </motion.div>
  )
}

// Función para resaltar la sintaxis de Python
function highlightPythonSyntax(line: string) {
  // Esta es una implementación simplificada. En un caso real, usaríamos una biblioteca
  // de resaltado de sintaxis más completa.

  // Palabras clave de Python
  const keywords = [
    "def",
    "if",
    "else",
    "elif",
    "return",
    "for",
    "in",
    "while",
    "import",
    "from",
    "as",
    "class",
    "try",
    "except",
    "finally",
    "with",
    "not",
    "and",
    "or",
    "True",
    "False",
    "None",
    "print",
    "len",
  ]

  // Dividir la línea en partes para resaltar
  const parts = []
  let currentWord = ""
  let inString = false
  let stringChar = ""

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    // Detectar comentarios
    if (char === "#" && !inString) {
      if (currentWord) {
        parts.push(<span key={`word-${i}`}>{currentWord}</span>)
        currentWord = ""
      }
      parts.push(
        <span key={`comment-${i}`} className="text-slate-500">
          {line.slice(i)}
        </span>,
      )
      break
    }

    // Detectar strings
    if ((char === '"' || char === "'") && (i === 0 || line[i - 1] !== "\\")) {
      if (inString && char === stringChar) {
        // Fin de string
        currentWord += char
        parts.push(
          <span key={`string-${i}`} className="text-amber-400">
            {currentWord}
          </span>,
        )
        currentWord = ""
        inString = false
      } else if (!inString) {
        // Inicio de string
        if (currentWord) {
          parts.push(<span key={`word-${i}`}>{currentWord}</span>)
          currentWord = ""
        }
        inString = true
        stringChar = char
        currentWord = char
      } else {
        // Otro caracter de string dentro de un string con otro delimitador
        currentWord += char
      }
      continue
    }

    if (inString) {
      currentWord += char
      continue
    }

    // Detectar espacios
    if (char === " " || char === "\t") {
      if (currentWord) {
        // Colorear palabras clave
        if (keywords.includes(currentWord)) {
          parts.push(
            <span key={`keyword-${i}`} className="text-purple-400">
              {currentWord}
            </span>,
          )
        } else if (!isNaN(Number(currentWord))) {
          parts.push(
            <span key={`number-${i}`} className="text-blue-400">
              {currentWord}
            </span>,
          )
        } else {
          parts.push(<span key={`word-${i}`}>{currentWord}</span>)
        }
        currentWord = ""
      }
      parts.push(<span key={`space-${i}`}>{char}</span>)
      continue
    }

    // Detectar operadores y símbolos
    if ("[]{}(),.:-+*/=%<>!&|^~".includes(char)) {
      if (currentWord) {
        if (keywords.includes(currentWord)) {
          parts.push(
            <span key={`keyword-${i}`} className="text-purple-400">
              {currentWord}
            </span>,
          )
        } else if (!isNaN(Number(currentWord))) {
          parts.push(
            <span key={`number-${i}`} className="text-blue-400">
              {currentWord}
            </span>,
          )
        } else {
          parts.push(<span key={`word-${i}`}>{currentWord}</span>)
        }
        currentWord = ""
      }
      parts.push(
        <span key={`operator-${i}`} className="text-cyan-400">
          {char}
        </span>,
      )
      continue
    }

    // Acumular caracteres para palabras
    currentWord += char
  }

  // Añadir la última palabra si existe
  if (currentWord) {
    if (keywords.includes(currentWord)) {
      parts.push(
        <span key="last-keyword" className="text-purple-400">
          {currentWord}
        </span>,
      )
    } else if (!isNaN(Number(currentWord))) {
      parts.push(
        <span key="last-number" className="text-blue-400">
          {currentWord}
        </span>,
      )
    } else {
      parts.push(<span key="last-word">{currentWord}</span>)
    }
  }

  return parts
}

export default function PythonCodeQuiz() {
  const [showWelcome, setShowWelcome] = useState(true)
  const [userName, setUserName] = useState("")
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [quizCancelled, setQuizCancelled] = useState(false)
  const [nameError, setNameError] = useState(false)

  const currentQuestion = quizData[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

  // Detectar cuando el usuario sale de la ventana
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !showWelcome && !quizCancelled) {
        setQuizCancelled(true)
        setScore(0)
      }
    }

    const handleBlur = () => {
      if (!showWelcome && !quizCancelled) {
        setQuizCancelled(true)
        setScore(0)
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    window.addEventListener("blur", handleBlur)

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      window.removeEventListener("blur", handleBlur)
    }
  }, [showWelcome, quizCancelled])

  const handleStartQuiz = () => {
    if (!userName.trim()) {
      setNameError(true)
      return
    }
    setNameError(false)
    setShowWelcome(false)
  }

  const handleAnswerClick = (answer: string) => {
    if (selectedAnswer) return // Prevenir múltiples selecciones

    setSelectedAnswer(answer)
    setShowExplanation(true)

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1) // Sumar 1 punto por respuesta correcta
    } else {
      setScore(Math.max(0, score - 1)) // Restar 1 punto por respuesta incorrecta, mínimo 0
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      // Quiz terminado - mostrar resultados finales
      setQuizCancelled(true)
    }
  }

  const handleRestartQuiz = () => {
    setShowWelcome(true)
    setUserName("")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setScore(0)
    setQuizCancelled(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {showWelcome ? (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="shadow-xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl text-center">
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                    className="inline-block mr-2"
                  >
                    🧠
                  </motion.div>
                  Quiz del José Python
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-800">¡Bienvenido al Quiz!</h2>
                  <div className="space-y-2">
                    <Label htmlFor="name">Ingresa tu nombre para comenzar:</Label>
                    <Input
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Tu nombre"
                      className={nameError ? "border-red-500" : ""}
                    />
                    {nameError && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm">
                        Por favor ingresa tu nombre para continuar
                      </motion.p>
                    )}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="font-bold text-lg text-slate-800 mb-2">Reglas del juego:</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-700">
                      <li>
                        Cada respuesta <span className="text-green-600 font-medium">correcta</span> suma{" "}
                        <span className="text-green-600 font-medium">1 punto</span>.
                      </li>
                      <li>
                        Cada respuesta <span className="text-red-600 font-medium">incorrecta</span> resta{" "}
                        <span className="text-red-600 font-medium">1 punto</span>.
                      </li>
                      <li>El puntaje mínimo es 0 (no hay puntos negativos).</li>
                    </ul>
                  </motion.div>

                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>¡Advertencia importante!</AlertTitle>
                    <AlertDescription>
                      Si sales de esta ventana o cambias a otra pestaña durante el quiz,
                       se cancelará automáticamente y
                       perderás todos tus puntos.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center p-6 bg-slate-50 rounded-b-lg">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleStartQuiz}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
                  >
                    Comenzar Quiz
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : quizCancelled ? (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <Card className="shadow-xl border-slate-200">
              <CardHeader className="bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-2xl text-center">Resultados del Quiz</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0, -10, 0] }}
                  transition={{ duration: 0.8 }}
                  className="mx-auto w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mb-4"
                >
                  <Trophy className="h-12 w-12 text-teal-600" />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-800">¡{userName}!</h2>

                <div className="text-lg">
                  {currentQuestionIndex === quizData.length - 1 && score > 0 ? (
                    <p>¡Has completado el quiz con éxito!</p>
                  ) : score === 0 ? (
                    <p>El quiz ha sido cancelado o has perdido todos tus puntos.</p>
                  ) : (
                    <p>
                      Has llegado hasta la pregunta {currentQuestionIndex + 1} de {quizData.length}.
                    </p>
                  )}
                </div>

                <div className="bg-slate-100 rounded-lg p-4 inline-block">
                  <span className="text-lg font-medium">Puntaje final: </span>
                  <span className="text-2xl font-bold text-teal-600">{score}</span>
                  <span className="text-lg font-medium"> de {quizData.length} posibles</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center p-6 bg-slate-50 rounded-b-lg">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleRestartQuiz}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
                  >
                    Reiniciar Quiz
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-6">
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-slate-800"
              >
                Hola, {userName}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-teal-100 text-teal-800 font-medium px-4 py-2 rounded-full"
              >
                Puntaje: {score} / {quizData.length}
              </motion.div>
            </div>

            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-slate-100 rounded-t-lg">
                <CardTitle className="text-xl text-center text-slate-800">
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={currentQuestionIndex}>
                    Pregunta {currentQuestionIndex + 1} de {quizData.length}
                  </motion.span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={`question-${currentQuestionIndex}`}
                  className="text-xl font-bold mb-4 text-slate-800"
                >
                  ¿Qué hace o representa este código?
                </motion.h2>

                {/* Bloque de código Python con estilo de IDE */}
                <CodeIDE code={currentQuestion.question} filename={currentQuestion.filename} />

                <div className="grid gap-4">
                  {currentQuestion.options.map((option, index) => (
                    <motion.div
                      key={`${currentQuestionIndex}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <Button
                        variant={selectedAnswer === option ? (isCorrect ? "outline" : "outline") : "outline"}
                        className={`h-auto py-4 px-6 text-lg justify-start border-2 w-full ${
                          selectedAnswer === option
                            ? option === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-50"
                              : selectedAnswer === option
                                ? "border-red-500 bg-red-50"
                                : "border-slate-200"
                            : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                        }`}
                        onClick={() => handleAnswerClick(option)}
                        disabled={selectedAnswer !== null}
                      >
                        <div className="flex items-center w-full">
                          <span className="flex-1 text-left">{option}</span>
                          {selectedAnswer === option && isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle className="h-6 w-6 text-green-500 ml-2" />
                            </motion.div>
                          )}
                          {selectedAnswer === option && !isCorrect && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <XCircle className="h-6 w-6 text-red-500 ml-2" />
                            </motion.div>
                          )}
                          {option === currentQuestion.correctAnswer && selectedAnswer && selectedAnswer !== option && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 15 }}
                            >
                              <CheckCircle className="h-6 w-6 text-green-500 ml-2" />
                            </motion.div>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>

                <AnimatePresence>
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`mt-6 p-4 rounded-lg ${
                        isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <p className="text-slate-800">
                        <span className="font-bold">{isCorrect ? "¡Correcto! " : "Incorrecto. "}</span>
                        {currentQuestion.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-end p-6 bg-slate-50 rounded-b-lg">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswer}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                  >
                    {currentQuestionIndex < quizData.length - 1 ? "Siguiente pregunta" : "Finalizar quiz"}
                  </Button>
                </motion.div>
              </CardFooter>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
