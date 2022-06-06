const RoundLoad = (input) => {    
    if(isNaN(input)) { 
        return null 
    }

    const components = (input / 2.5)
    return components * 2.5
}

const Progress = (input) => {
    let numericalInput = parseFloat(input)
    if(numericalInput) {
        return numericalInput + 2.5
    }
}

const DeadliftProgress = (input) => {
    let numericalInput = parseFloat(input)
    if(numericalInput) {
        return numericalInput + 5
    }
}

const Deload = (input) => {
    let numericalInput = parseFloat(input)
    if(numericalInput) {
        return RoundLoad(0.8 * input)
    }
}

module.exports = {
    RoundLoad, Progress, DeadliftProgress, Deload
}