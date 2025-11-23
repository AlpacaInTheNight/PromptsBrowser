import { DEFAULT_PROMPT_WEIGHT } from 'client/const'


export default function getWeightStyle(weight: number) {
    if(weight === DEFAULT_PROMPT_WEIGHT) return false;

    let weightStyle = {
        transform: "",
        zIndex: 1,
        color: "",
    }

    if(weight < 1 && weight > 0.6) {
        weightStyle = {
            transform: "scale(0.9)",
            zIndex: 3,
            color: "green",
        }

    } else if(weight <= 0.6 && weight > 0.4) {
        weightStyle = {
            transform: "scale(0.8)",
            zIndex: 2,
            color: "blue",
        }
        
    } else if(weight <= 0.4) {
        weightStyle = {
            transform: "scale(0.7)",
            zIndex: 1,
            color: "purple",
        }

    }

    if(weight > 1 && weight <= 1.2) {
        weightStyle = {
            transform: "scale(1.1)",
            zIndex: 4,
            color: "orange",
        }

    } else if(weight > 1.2 && weight <= 1.3) {
        weightStyle = {
            transform: "scale(1.2)",
            zIndex: 5,
            color: "orangered",
        }

    } else if(weight > 1.3) {
        weightStyle = {
            transform: "scale(1.3)",
            zIndex: 6,
            color: "red",
        }
    }

    return weightStyle;
}
