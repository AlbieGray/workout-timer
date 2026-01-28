import { useState, useEffect} from 'react'
import beepSound from "../res/soft_beep.mp3"
import longBeepSound from "../res/long_beep.mp3"
import './App.css'




function App() {
  const DEFAULT_REST_TIME: number = 40
  const DEFAULT_WORKOUT_TIME: number = 10
  const DEFAULT_REPS:number = 10
  const COUNTDOWN_TIME: number = 3

  const [rest_time, setRestTime] = useState(DEFAULT_REST_TIME)
  const [workout_time, setWorkoutTime] = useState(DEFAULT_WORKOUT_TIME)
  const [reps, setReps] = useState(DEFAULT_REPS)
  const [timeRemainingDisplay, setTimeRemainingDisplay] = useState("")
  const [existingCountdowns, setExistingCountdowns] = useState<number[]>([])
  
  const [repsRemaining, setRepsRemaining] = useState(0)
  const [intervalState, setIntervalState] = useState("idle")
  const [stateString, setStateString] = useState("")

  const [timerExpired, setTimerExpired] = useState(false)

  function countdown(time: number) {
    console.log("starting countdown, time: ", time)
    let timeRemaining = time
    setTimeRemainingDisplay(timeRemaining.toString())
    var countdownInterval = setInterval(function() {
      if (timeRemaining == 1) {
	playLongBeep()
        clearInterval(countdownInterval)
	setTimerExpired(true)
      } else {
	if (timeRemaining == 2 || timeRemaining == 3 || timeRemaining == 4) {
	  playBeep()
	}
        timeRemaining = timeRemaining - 1
	setTimeRemainingDisplay(timeRemaining.toString())
      }
    }, 1000, timeRemaining)
    setExistingCountdowns([...existingCountdowns, countdownInterval])
  }

  function runWorkout() {
    playBeep()
    existingCountdowns.forEach((element) => {
      clearInterval(element)})
    setExistingCountdowns([])

    setRepsRemaining(reps)
    setIntervalState("starting")
    setTimerExpired(true)
  }

  useEffect(() => {
    if (timerExpired == false) {
      return
    }
    setTimerExpired(false)
    console.log("advancing, state: ", intervalState)
    if (intervalState == "starting"){
      console.log("entering state: starting")
      setIntervalState("countdown")
      countdown(COUNTDOWN_TIME)
    } else if (intervalState == "countdown") {
      console.log("entering state: workout")
      setIntervalState("workout")
      setRepsRemaining(repsRemaining - 1)
      countdown(workout_time)
    } else if (intervalState == "rest") {
      console.log("entering state: workout")
      setIntervalState("workout")
      setRepsRemaining(repsRemaining - 1)
      countdown(workout_time)
    } else if (intervalState == "workout") {
      console.log("entering state: rest")
	if (repsRemaining > 0) {
	  console.log("entering state: rest")
          setIntervalState("rest")
	  countdown(rest_time)
	} else {
	  console.log("resetting")
	  setIntervalState("idle")
	}
    }
  }, [timerExpired])

  useEffect(() => {
    if (intervalState == "idle") {
      setStateString("")
    } else if (intervalState == "countdown") {
      setStateString("Get ready")
    } else if (intervalState == "workout") {
      setStateString("Go")
    } else if (intervalState == "rest") {
      setStateString("Rest")
    }

  }, [intervalState])





  function playBeep() {
    const beep = new Audio(beepSound)
    beep.play()
  }
  function playLongBeep() {
    const beep = new Audio(longBeepSound)
    beep.play()
  }


  return (
    <>
      <h1>Workout timer</h1>
      <div className="card">
	<p> Rest time: </p>
	<label>
	  <input name="rest_time_input" type="number" defaultValue={DEFAULT_REST_TIME} onChange={(event) => setRestTime(() => parseInt(event.target.value))}/>
	</label>
      </div>
      <div className="card">
	<p> Workout time: </p>
	<label>
	  <input name="workout_time_input" type="number" defaultValue={DEFAULT_WORKOUT_TIME} onChange={(event) => setWorkoutTime(() => parseInt(event.target.value))}/>
	</label>
      </div>
      <div className="card">
	<p> Reps: </p>
	<label>
	  <input name="reps_input" type="number" defaultValue={DEFAULT_REPS} onChange={(event) => setReps(() => parseInt(event.target.value))}/>
	</label>
      </div>
      <div>
	<button onClick={runWorkout}>
	  start Workout
	</button>
      </div>
      <div>
	
	<p> {timeRemainingDisplay} </p>
	<p> {stateString} </p>
	<p> reps remaining: {repsRemaining} </p>
      </div>
    </>
  )
}

export default App
