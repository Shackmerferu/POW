import { FormEvent, useEffect, useRef, useState } from "react"

const logo = "frontend-web/src/cosas/imagenes/logo.png"
const LAST_AUTOMATIC_SLIDE = 3

type AccessMode = "login" | "register"

function Brand() {
  return <img className="brand-logo" src={logo} alt="Facultad de Ingeniería" />
}

function login() {
  const [slide, setSlide] = useState(0)
  const [accessMode, setAccessMode] = useState<AccessMode>("login")
  const [feedback, setFeedback] = useState("")
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (reducedMotion) {
      setSlide(LAST_AUTOMATIC_SLIDE)
      return
    }

    const delays = [1350, 1050, 1150]
    const advance = (current: number) => {
      if (current >= LAST_AUTOMATIC_SLIDE) return
      timerRef.current = window.setTimeout(() => {
        const next = current + 1
        setSlide(next)
        advance(next)
      }, delays[current])
    }

    advance(0)
    return () => window.clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && slide === 4) {
        setFeedback("")
        setSlide(3)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [slide])

  const openAccess = (mode: AccessMode) => {
    setAccessMode(mode)
    setFeedback("")
    setSlide(4)
  }

  const submitAccess = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const studentId = String(form.get("studentId") ?? "").trim()
    const password = String(form.get("password") ?? "")

    if (!studentId || !password) {
      setFeedback("Completá tu legajo y contraseña.")
      return
    }

    setFeedback(
      accessMode === "login"
        ? "Datos recibidos. La sesión está lista para conectarse al sistema."
        : "Datos recibidos. El registro está listo para conectarse al sistema.",
    )
  }

  return (
    <main className="experience" aria-live="polite">
      <section
        className={`slide splash splash--large ${
          slide === 0 ? "is-active" : ""
        }`}
        aria-hidden={slide !== 0}
      >
        <div className="splash-logo splash-logo--large">
          <Brand />
        </div>
      </section>

      <section
        className={`slide splash splash--small ${
          slide === 1 ? "is-active" : ""
        }`}
        aria-hidden={slide !== 1}
      >
        <div className="splash-logo splash-logo--small">
          <Brand />
        </div>
      </section>

      <section
        className={`slide system-slide ${slide === 2 ? "is-active" : ""}`}
        aria-hidden={slide !== 2}
      >
        <div className="blue-panel" />
        <div className="identity">
          <h1>
            Sistema de gestion
            <span>de convenios</span>
          </h1>
          <Brand />
        </div>
      </section>

      <section
        className={`slide system-slide menu-slide ${
          slide === 3 ? "is-active" : ""
        }`}
        aria-hidden={slide !== 3}
      >
        <div className="blue-panel">
          <nav className="menu-actions" aria-label="Opciones de acceso">
            <button
              className="primary-action"
              type="button"
              onClick={() => openAccess("login")}
            >
              Iniciar Sesion
            </button>
            <button
              className="secondary-action"
              type="button"
              onClick={() => openAccess("register")}
            >
              Registrarse
            </button>
          </nav>
        </div>
        <div className="identity">
          <h1>
            Sistema de gestion
            <span>de convenios</span>
          </h1>
          <Brand />
        </div>
      </section>

      <section
        className={`slide system-slide access-slide ${
          slide === 4 ? "is-active" : ""
        }`}
        aria-hidden={slide !== 4}
      >
        <div className="blue-panel">
          <form className="access-form" onSubmit={submitAccess}>
            <label htmlFor="studentId">Legajo</label>
            <input
              id="studentId"
              name="studentId"
              inputMode="numeric"
              autoComplete="username"
              placeholder="45566115"
              disabled={slide !== 4}
            />

            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                accessMode === "login" ? "current-password" : "new-password"
              }
              placeholder="**********"
              disabled={slide !== 4}
            />

            <button className="secondary-action submit-action" type="submit">
              {accessMode === "login" ? "Iniciar Sesion" : "Registrarse"}
            </button>
            {feedback && (
              <p className="form-feedback" role="status">
                {feedback}
              </p>
            )}
            <button
              className="back-action"
              type="button"
              onClick={() => setSlide(3)}
            >
              Volver
            </button>
          </form>
        </div>
        <div className="identity identity--access">
          <h1>
            Sistema de gestion
            <span>de convenios</span>
          </h1>
          <Brand />
        </div>
      </section>
    </main>
  )
}

export default login
