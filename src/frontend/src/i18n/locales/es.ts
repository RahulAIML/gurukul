import type { TranslationKey } from './en';

/**
 * Spanish (neutral / Latin American).
 *
 * Typed as `Record<TranslationKey, string>` against the English key set, so a
 * key added to `en.ts` and missed here fails the type check.
 *
 * TRANSLATION STATUS: working translations written during implementation, not
 * reviewed by a native speaker. Register is neutral Latin American Spanish
 * using "tú" (the product speaks to one person, informally) and avoiding
 * Iberian-only vocabulary. Gym vocabulary that Spanish-speaking lifters
 * actually use in English — "cardio", "HIIT", "BMI"/"IMC" — follows local
 * convention rather than being forced into coinages. Flag for review before
 * launch.
 */
export const es: Record<TranslationKey, string> = {
  /* ── brand / shell ───────────────────────────────────────────── */
  'brand.name': 'Gurukul',
  'common.continue': 'Continuar',
  'common.back': 'Atrás',
  'common.skip': 'Omitir',
  'common.startOver': 'Empezar de nuevo',
  'common.step': 'Paso {current} de {total}',
  'common.selectAllThatApply': 'Selecciona todas las que apliquen',
  'common.loading': 'Cargando…',
  'common.or': 'o',
  'common.optional': 'Opcional',

  /* ── language ────────────────────────────────────────────────── */
  'language.label': 'Idioma',
  'language.en': 'English',
  'language.hi': 'हिन्दी',

  /* ── landing ─────────────────────────────────────────────────── */
  'landing.eyebrow': 'Entrenamiento personalizado',
  'landing.headline.line1': 'Medimos.',
  'landing.headline.line2': 'Te guiamos.',
  'landing.headline.line3': 'Tú cambias.',
  'landing.body':
    'Tu camino hacia una mejor versión de ti empieza aquí. Estamos creando una experiencia personalizada según tus objetivos: comienza con unas pocas preguntas y no necesitas cuenta.',
  'landing.cta': 'Comienza tu camino',
  'landing.reassurance.noCard': 'Sin tarjeta',
  'landing.reassurance.quick': 'Dos minutos',
  'landing.reassurance.leave': 'Puedes salir cuando quieras',
  'landing.footer':
    'Esta es una versión inicial: la experiencia completa de Gurukul está en desarrollo.',

  /* ── sections ────────────────────────────────────────────────── */
  'section.profile': 'Sobre ti',
  'section.goal': 'Tu objetivo',
  'section.experience': 'Tu experiencia',
  'section.environment': 'Dónde entrenas',
  'section.equipment': 'Qué tienes',
  'section.time': 'Tu tiempo',
  'section.preference': 'Cómo te gusta entrenar',
  'section.motivation': 'Qué significa el éxito',
  'section.lifestyle': 'Tu día',
  'section.measurements': 'Tus medidas',

  /* ── Q1 gender ───────────────────────────────────────────────── */
  'q.gender.title': '¿Qué te describe mejor?',
  'q.gender.helper': 'Esto ajusta el volumen de entrenamiento y la recuperación.',
  'q.gender.male': 'Hombre',
  'q.gender.female': 'Mujer',

  /* ── Q2 primary goal ─────────────────────────────────────────── */
  'q.goal.title': '¿Qué te gustaría lograr?',
  'q.goal.helper': 'Elige lo que más te importa. Todo lo demás se ajusta a eso.',
  'q.goal.buildMuscle': 'Ganar músculo',
  'q.goal.buildMuscle.desc': 'Tamaño y forma, con entrenamiento estructurado',
  'q.goal.loseFat': 'Perder grasa',
  'q.goal.loseFat.desc': 'Más ligero y definido, sin extremos',
  'q.goal.getStronger': 'Ser más fuerte',
  'q.goal.getStronger.desc': 'Capacidad real, semana a semana',
  'q.goal.improveFitness': 'Mejorar mi condición',
  'q.goal.improveFitness.desc': 'Salud y energía en general',
  'q.goal.buildStamina': 'Ganar resistencia',
  'q.goal.buildStamina.desc': 'Respiración, aguante y constancia',

  /* ── Q3 fitness level ────────────────────────────────────────── */
  'q.level.title': '¿En qué punto está tu entrenamiento hoy?',
  'q.level.helper': 'Responde con sinceridad: el plan se ajusta igual.',
  'q.level.beginner': 'Empiezo ahora',
  'q.level.beginner.desc': 'Nuevo en el entrenamiento, o vuelvo tras una pausa larga',
  'q.level.some': 'Algo de experiencia',
  'q.level.some.desc': 'He entrenado a ratos, conozco los movimientos básicos',
  'q.level.intermediate': 'Intermedio',
  'q.level.intermediate.desc': 'Entreno de forma constante desde seis meses o más',
  'q.level.advanced': 'Avanzado',
  'q.level.advanced.desc': 'Años de práctica, planifico por mi cuenta',

  /* ── Q4 training location ────────────────────────────────────── */
  'q.location.title': '¿Dónde prefieres entrenar?',
  'q.location.helper': 'Construimos el plan según el espacio que realmente tienes.',
  'q.location.gym': 'En el gimnasio',
  'q.location.gym.desc': 'Instalación completa, todo el equipo',
  'q.location.home': 'En casa',
  'q.location.home.desc': 'Tu espacio, a tu horario',
  'q.location.outdoors': 'Al aire libre',
  'q.location.outdoors.desc': 'Parques y espacios abiertos',
  'q.location.mixed': 'En varios lugares',
  'q.location.mixed.desc': 'Donde el día lo permita',

  /* ── Q5 equipment ────────────────────────────────────────────── */
  'q.equipment.title': '¿Qué equipo tienes a mano?',
  'q.equipment.helper': 'Selecciona todas las que apliquen.',
  'q.equipment.fullGym': 'Gimnasio completo',
  'q.equipment.fullGym.desc': 'Racks, máquinas y todo el rango de pesos',
  'q.equipment.dumbbells': 'Mancuernas',
  'q.equipment.dumbbells.desc': 'Un par, ajustables o fijas',
  'q.equipment.basic': 'Equipo básico',
  'q.equipment.basic.desc': 'Pesa rusa, colchoneta, banco o similar',
  'q.equipment.none': 'Sin equipo',
  'q.equipment.none.desc': 'Solo peso corporal: funciona perfectamente',
  'q.equipment.mixed': 'Varía',
  'q.equipment.mixed.desc': 'Distinto equipo según el día',

  /* ── Q6 session duration ─────────────────────────────────────── */
  'q.duration.title': '¿Cuánto puede durar realmente una sesión?',
  'q.duration.helper': 'La constancia importa más que la duración.',
  'q.duration.short': '15–20 minutos',
  'q.duration.short.desc': 'Sesiones cortas y concentradas',
  'q.duration.medium': '30 minutos',
  'q.duration.medium.desc': 'Un bloque estable y sostenible',
  'q.duration.long': '45 minutos',
  'q.duration.long.desc': 'Espacio para una sesión completa',
  'q.duration.extended': '60+ minutos',
  'q.duration.extended.desc': 'Práctica completa, sin prisa',
  'q.duration.varies': 'Varía',
  'q.duration.varies.desc': 'Distinto tiempo según el día',

  /* ── Q7 training days ────────────────────────────────────────── */
  'q.days.title': '¿Cuántos días por semana puedes entrenar de verdad?',
  'q.days.helper': 'Piensa en una semana normal, no en tu mejor semana.',
  'q.days.two': '2 días',
  'q.days.two.desc': 'Suficiente para progresar de verdad',
  'q.days.three': '3 días',
  'q.days.three.desc': 'El ritmo sostenible más común',
  'q.days.four': '4 días',
  'q.days.four.desc': 'Espacio para dividir el trabajo',
  'q.days.five': '5 días',
  'q.days.five.desc': 'Una estructura semanal comprometida',
  'q.days.sixPlus': '6+ días',
  'q.days.sixPlus.desc': 'Entrenar ya es parte de tu día',

  /* ── Q8 workout preference ───────────────────────────────────── */
  'q.preference.title': '¿Qué tipo de entrenamiento disfrutas?',
  'q.preference.helper':
    'Selecciona todo lo que te atraiga. Damos más peso a lo que realmente vas a hacer.',
  'q.preference.strength': 'Fuerza',
  'q.preference.strength.desc': 'Más peso, menos repeticiones',
  'q.preference.muscle': 'Hipertrofia',
  'q.preference.muscle.desc': 'Peso moderado, más volumen',
  'q.preference.cardio': 'Cardio',
  'q.preference.cardio.desc': 'Correr, bicicleta, remo',
  'q.preference.hiit': 'HIIT',
  'q.preference.hiit.desc': 'Series intensas con descansos cortos',
  'q.preference.mobility': 'Movilidad',
  'q.preference.mobility.desc': 'Rango de movimiento, estiramiento, control',
  'q.preference.mixed': 'Una mezcla',
  'q.preference.mixed.desc': 'La variedad lo mantiene interesante',

  /* ── Q9 motivation ───────────────────────────────────────────── */
  'q.motivation.title': '¿Qué te haría sentir que lo lograste?',
  'q.motivation.helper': 'Aquí no hay respuesta incorrecta.',
  'q.motivation.look': 'Verme mejor',
  'q.motivation.look.desc': 'Un cambio visible en el espejo',
  'q.motivation.strong': 'Sentirme más fuerte',
  'q.motivation.strong.desc': 'Capaz en la vida diaria',
  'q.motivation.health': 'Mejorar mi salud',
  'q.motivation.health.desc': 'Energía, sueño y bienestar a largo plazo',
  'q.motivation.confidence': 'Ganar confianza',
  'q.motivation.confidence.desc': 'Cómo te presentas ante el mundo',
  'q.motivation.consistency': 'Ser constante',
  'q.motivation.consistency.desc': 'Aparecer ya es ganar',
  'q.motivation.stress': "Manejar el estrés",
  'q.motivation.stress.desc': "Un lugar donde dejar la presión del día",
  'q.motivation.calm': "Sentirme más tranquilo",
  'q.motivation.calm.desc': "La mente más estable y mejor sueño",
  'q.motivation.wellbeingNote': "El entrenamiento puede ayudar a cómo te sientes, pero no sustituye la atención profesional de salud mental. Si lo estás pasando mal, habla con un profesional.",
  'q.motivation.performance': 'Mejorar mi rendimiento',
  'q.motivation.performance.desc': 'Un deporte o una habilidad concreta',

  /* ── Q10 activity level ──────────────────────────────────────── */
  'q.activity.title': '¿Qué tan activo es tu día normal?',
  'q.activity.helper': 'Sin contar el entrenamiento. Define cuánta recuperación incluimos.',
  'q.activity.sedentary': 'Sobre todo sentado',
  'q.activity.sedentary.desc': 'Trabajo de escritorio, poco caminar',
  'q.activity.light': 'Poco activo',
  'q.activity.light.desc': 'Camino algo durante el día',
  'q.activity.moderate': 'Moderadamente activo',
  'q.activity.moderate.desc': 'De pie con frecuencia',
  'q.activity.veryActive': 'Muy activo',
  'q.activity.veryActive.desc': 'Trabajo físico o movimiento constante',

  /* ── Q11–13 measurements ─────────────────────────────────────── */
  'q.age.title': '¿Cuántos años tienes?',
  'q.age.helper': 'La recuperación cambia con la edad: esto mantiene el plan realista.',
  'q.height.title': '¿Cuánto mides?',
  'q.height.helper': 'Se usa con tu peso para calcular el IMC y ajustar los rangos de movimiento.',
  'q.weight.title': '¿Cuál es tu peso actual?',
  'q.weight.helper': 'Es un punto de partida, no un juicio. Define tu base de carga.',

  'measure.range': 'Entre {min} y {max} {unit}',
  'measure.outOfRange': 'Introduce un valor entre {min} y {max} {unit}',
  'measure.heightHint': 'Pies y pulgadas. Al cambiar de unidad se conserva tu medida.',
  'measure.unit': 'Unidad',
  'measure.unit.years': 'años',
  'measure.unit.cm': 'cm',
  'measure.unit.ftin': 'ft/in',
  'measure.unit.kg': 'kg',
  'measure.unit.lb': 'lb',
  'measure.feet': 'ft',
  'measure.inches': 'in',

  /* ── validation ──────────────────────────────────────────────── */
  'validation.inchesRange': 'Las pulgadas deben estar entre 0 y {max}',
  'validation.required': 'Elige una opción para continuar',
  'validation.chooseAtLeast': 'Elige al menos {count} para continuar',
  'validation.chooseAtLeastOne': 'Elige al menos una opción para continuar',
  'validation.integerOnly': 'Introduce un número entero',
  'validation.invalidNumber': 'Introduce un número',

  /* ── analysis ────────────────────────────────────────────────── */
  'analysis.preparing.title': 'Analizando tus respuestas…',
  'analysis.preparing.body': 'Estamos preparando tu punto de partida.',
  'analysis.eyebrow': 'Tu análisis',
  'analysis.title': 'Esto es lo que entendemos de ti',
  'analysis.summary.goal': 'Objetivo',
  'analysis.summary.level': 'Experiencia',
  'analysis.summary.location': 'Lugar',
  'analysis.summary.equipment': 'Equipo',
  'analysis.summary.time': 'Duración de sesión',
  'analysis.summary.days': 'Días por semana',
  'analysis.summary.activity': 'Actividad diaria',
  'analysis.summary.age': 'Edad',
  'analysis.summary.height': 'Altura',
  'analysis.summary.weight': 'Peso',

  'bmi.title': 'Tu IMC',
  'bmi.calculated': 'Tu IMC calculado es {value}',
  'bmi.range.label': 'Rango considerado saludable habitualmente',
  'bmi.range.value': '18,5 – 24,9',
  'bmi.category.under': 'Tu resultado está por debajo del rango de IMC considerado saludable.',
  'bmi.category.healthy': 'Tu resultado está dentro del rango de IMC considerado saludable.',
  'bmi.category.over': 'Tu resultado está por encima del rango de IMC considerado saludable.',
  'bmi.category.high':
    'Tu resultado está bastante por encima del rango de IMC considerado saludable.',
  'bmi.disclaimer':
    'El IMC es una medida general de detección. No tiene en cuenta la masa muscular, la composición corporal ni la estructura, por lo que describe mejor a poblaciones que a personas. No es un diagnóstico: habla con un profesional de salud sobre tu caso.',

  'plan.eyebrow': 'Tu punto de partida',
  'plan.title': '{focus}',
  'plan.rationale':
    'Según tu objetivo, tu experiencia y el tiempo que tienes, hemos orientado tu punto de partida hacia {focusLower}.',
  'plan.focus': 'Enfoque',
  'plan.frequency': 'Frecuencia',
  'plan.frequency.value': '{days} días / semana',
  'plan.session': 'Duración de sesión',
  'plan.session.value': '{minutes} minutos',
  'plan.difficulty': 'Dificultad inicial',
  'plan.environment': 'Lugar',
  'plan.equipment': 'Equipo',
  'plan.adjusted.frequency':
    'Indicaste {asked} días. Hemos fijado el plan en {given} para dejar margen de recuperación en tu etapa actual; puedes aumentarlo cuando el trabajo te resulte fácil.',
  'plan.notMedical': 'Estas son recomendaciones de entrenamiento, no consejo médico.',
  'plan.previewNote':
    'Este es tu punto de partida. El programa sesión por sesión es lo siguiente que estamos construyendo: aún no está listo, y preferimos no mostrarte nada antes que inventarlo.',
  'plan.cta': 'Guardar mi plan',
  'plan.ctaHelper': 'Crea una cuenta para conservar tus respuestas y tu plan.',

  /* ── focus labels ────────────────────────────────────────────── */
  'focus.beginnerFoundation': 'Base para principiantes',
  'focus.strengthMuscle': 'Fuerza e hipertrofia',
  'focus.hypertrophy': 'Hipertrofia',
  'focus.strength': 'Fuerza',
  'focus.leanConditioning': 'Acondicionamiento',
  'focus.enduranceBase': 'Base de resistencia',
  'focus.generalFitness': 'Condición general',
  'focus.mobilityFoundation': 'Movilidad y base',

  'difficulty.gentle': 'Suave',
  'difficulty.beginner': 'Principiante',
  'difficulty.moderate': 'Moderada',
  'difficulty.challenging': 'Exigente',

  /* ── auth ────────────────────────────────────────────────────── */
  'auth.signup.title': 'Crea tu cuenta',
  'auth.signup.subtitle': 'Para conservar tus respuestas y tu plan.',
  'auth.login.title': 'Bienvenido de nuevo',
  'auth.login.subtitle': 'Inicia sesión para continuar donde lo dejaste.',
  'auth.email': 'Correo electrónico',
  'auth.password': 'Contraseña',
  'auth.confirmPassword': 'Confirmar contraseña',
  'auth.createAccount': 'Crear cuenta',
  'auth.logIn': 'Iniciar sesión',
  'auth.logOut': 'Cerrar sesión',
  'auth.forgotPassword': '¿Olvidaste tu contraseña?',
  'auth.haveAccount': '¿Ya tienes cuenta?',
  'auth.noAccount': '¿No tienes cuenta?',
  'auth.continueWithGoogle': 'Continuar con Google',
  'auth.passwordHint': 'Al menos 8 caracteres',
  'auth.error.emailRequired': 'Introduce tu correo electrónico',
  'auth.error.emailInvalid': 'Introduce un correo electrónico válido',
  'auth.error.passwordRequired': 'Introduce una contraseña',
  'auth.error.passwordTooShort': 'La contraseña debe tener al menos 8 caracteres',
  'auth.error.passwordMismatch': 'Las contraseñas no coinciden',
  'auth.error.emailTaken': 'Ya existe una cuenta con este correo electrónico',
  'auth.error.invalidCredentials': 'Ese correo y contraseña no coinciden',
  'auth.error.network': 'No pudimos conectar con el servidor. Revisa tu conexión e inténtalo otra vez.',
  'auth.error.sessionExpired': 'Tu sesión ha caducado. Inicia sesión de nuevo.',
  'auth.error.unknown': 'Algo falló de nuestro lado. Inténtalo otra vez.',
  'auth.error.notConfigured':
    'Las cuentas aún no están disponibles en esta versión: el servicio de autenticación se está construyendo. Mientras tanto tus respuestas se guardan en este dispositivo.',
  'auth.notConfigured.badge': 'Aún no disponible',

  'auth.signUp': 'Crear cuenta',
  'auth.name': 'Nombre',
  'auth.backToLogIn': 'Volver a iniciar sesión',
  'auth.error.nameTooLong': 'Usa 80 caracteres o menos',
  'auth.error.confirmRequired': 'Confirma tu contraseña',
  'auth.signup.carryAnswers':
    'Tus {count} respuestas se guardarán en tu cuenta. No se pierde nada.',
  'auth.reset.title': 'Restablece tu contraseña',
  'auth.reset.subtitle': 'Te enviaremos un enlace por correo para elegir una nueva.',
  'auth.reset.action': 'Enviar enlace',
  'auth.reset.hint': 'El correo con el que te registraste',
  'auth.reset.sentTitle': 'Revisa tu correo',
  'auth.reset.sentBody':
    'Si existe una cuenta para {email}, el enlace ya está en camino. Caduca en una hora.',

  /* ── account menu ─────────────────────────────────────────────── */
  'account.menuLabel': 'Cuenta',
  'account.profile': 'Mi perfil',
  'account.plan': 'Mi plan',
  'account.settings': 'Ajustes',
  'account.memberSince': 'Miembro desde',
  'account.answersSaved': 'Respuestas guardadas',
  'account.viewResults': 'Ver mis resultados',
  'account.inDevelopment.badge': 'En desarrollo',
  'account.plan.inDevelopment':
    'Tu plan de entrenamiento aún no se ha generado. El cuestionario y tus resultados son el primer paso; el plan llegará en una versión posterior.',
  'account.settings.inDevelopment':
    'Los ajustes de la cuenta todavía se están construyendo. Mientras tanto puedes cambiar el idioma desde la cabecera en cualquier pantalla.',
};
