const RoundLoad = (input) => {    
    if(isNaN(input)) {
        return null
    }
    const components = (input / 2.5)
    return components * 2.5;
}

const Progress = (input) => {
    return RoundLoad(1.025 * input)
}

const DeadliftProgress = (input) => {
    return RoundLoad(1.05 * input)
}

const Deload = (input) => {
    return RoundLoad(0.8 * input)
}

module.exports = {
    RoundLoad, Progress, DeadliftProgress, Deload
}