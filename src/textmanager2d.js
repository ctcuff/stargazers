import { max } from "d3-array";
import { setSamplerParameters } from "twgl.js";

class TextManager2D
{
    constructor()
    {
        this.highScore = 0;

        this.scoreField = document.querySelector("#score");
        this.scoreNode = document.createTextNode("0");
        this.scoreField.appendChild(this.scoreNode);

        this.centerField = document.querySelector("#center-text");
        this.centerFieldNode = document.createTextNode("");
        this.centerField.appendChild(this.centerFieldNode);

        this.hsField = document.querySelector("#high_score");
        this.hs_node = document.createTextNode("0");
        this.hsField.appendChild(this.hs_node);
    }

    dimScreen()
    {
        document.querySelector("#center-overlay").style.opacity = 0.9;
    }

    undimScreen()
    {
        document.querySelector("#center-overlay").style.opacity = 0.0;
    }

    gameOver(score)
    {
        this.highScore = Math.max(score, this.highScore);
        this.hs_node.nodeValue = this.highScore;
        this.updateCenterText("Game over! Your score was " + score + ". Press any key to start again!");
        this.dimScreen()
    }

    updateScore(text)
    {
        this.scoreNode.nodeValue = text;
    }

    updateCenterText(text)
    {
        this.centerFieldNode.nodeValue = text;
        this
    }

    disableCenterText()
    {
        this.centerField.style.visibility = "hidden";
    }

    enableCenterText()
    {
        this.centerField.style.visibility = "visible";
    }
}

export default TextManager2D;