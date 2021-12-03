class TextManager2D
{
    constructor()
    {
        this.highScore = 0;
        this.score = 0;

        this.scoreField = document.querySelector("#score");
        this.scoreNode = document.createTextNode("0");
        this.scoreField.appendChild(this.scoreNode);

        this.centerField = document.querySelector("#center-text");
        this.centerFieldNode = document.createTextNode("");
        this.centerField.appendChild(this.centerFieldNode);

        this.hsField = document.querySelector("#high_score");
        this.hs_node = document.createTextNode("0");
        this.hsField.appendChild(this.hs_node);

        this.hp_bars = [document.getElementById("hp1"), document.getElementById("hp2"), document.getElementById("hp3")]; 
    }

    loseLife(idx)
    {
        this.hp_bars[idx - 1].style.visibility = "hidden";
    }

    restoreLives()
    {
        for (let i = 0; i < 3; i++)
            this.hp_bars[i].style.visibility = "visible";
    }

    dimScreen()
    {
        document.querySelector("#center-overlay").style.opacity = 0.9;
    }

    undimScreen()
    {
        document.querySelector("#center-overlay").style.opacity = 0.0;
    }

    gameOver()
    {
        this.hs_node.nodeValue = this.highScore;
        this.updateCenterText("Game over! Your score was " + this.score + ". Restarting in five seconds...");
        this.count = false;
        this.dimScreen();
    }

    updateScore(text)
    {
        this.score = parseInt(text);

        // Automatically update the high score if applicable
        this.hs_node.nodeValue = (this.highScore = Math.max(this.score, this.highScore));

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

const uiManager = new TextManager2D();

export {uiManager as default, TextManager2D};